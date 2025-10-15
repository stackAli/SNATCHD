import os
from flask import Flask, jsonify, request, send_from_directory, render_template, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from functools import wraps
from models import db, Category, Product
from sqlalchemy import func
from flask_mail import Mail, Message  # <-- NEW

# --- Base Directory ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# --- Flask App Setup ---
app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'build', 'static'),
    template_folder=os.path.join(BASE_DIR, 'build'),
    static_url_path='/static'
)
CORS(app,
     supports_credentials=True,
     origins=[
         "http://localhost:3000",
         "http://127.0.0.1:3000"
     ])

app.secret_key = os.environ.get("FLASK_SECRET_KEY", "supersecretkey")
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True
)
# --- Config ---
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'db.sqlite3')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'avif'}

# --- Mail Config (for sending orders & contact forms) ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'snatchd9@gmail.com'  # your Gmail address
app.config['MAIL_PASSWORD'] = 'oxmn wjdo qhtq blpb'  # your Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = 'snatchd9@gmail.com'

mail = Mail(app)

# --- Initialize DB ---
db.init_app(app)

# --- Admin Credentials ---
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "password")


# --- Helpers ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def login_required(f):
    """Decorator to protect admin routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('logged_in'):
            return jsonify({"success": False, "message": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated


# --- Auth & Session Routes ---
@app.route('/api/check-login', methods=['GET'])
def check_login():
    if session.get('logged_in'):
        return jsonify({"logged_in": True})
    return jsonify({"logged_in": False}), 401


@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        session['logged_in'] = True
        return jsonify({"success": True, "message": "Logged in successfully"})
    return jsonify({"success": False, "message": "Invalid username or password"}), 401


@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('logged_in', None)
    return jsonify({"success": True, "message": "Logged out successfully"})


# --- API Routes ---
@app.route('/api/')
def home_data():
    return jsonify({"message": "Welcome to the Home page!"})


@app.route('/api/shop')
def shop_data():
    category_name = request.args.get('category')
    query = Product.query

    if category_name and category_name.lower() != "all":
        # Use partial match instead of strict == to catch small mismatches like "Rings" vs "Ring"
        query = query.join(Category).filter(func.lower(Category.name).like(f"%{category_name.lower()}%"))

    products = query.all()
    print(f"✅ Returning {len(products)} products for category '{category_name}'")  # Debug log
    return jsonify([p.to_dict() for p in products])



@app.route('/api/contact')
def contact_data():
    return jsonify({"email": "contact@yourshop.com", "phone": "123-456-7890"})


# --- Admin Product Management ---
@app.route('/api/admin/products', methods=['POST'])
@login_required
def add_product():
    name = request.form['name']
    description = request.form['description']
    price = float(request.form['price'])
    category_id = int(request.form['category_id'])

    image_url = ""
    image = request.files.get('image')
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        image.save(upload_path)
        image_url = f"/uploads/{filename}"

    product = Product(
        name=name,
        description=description,
        price=price,
        image=image_url,
        category_id=category_id
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({"message": "Product added", "product": product.to_dict()}), 201


@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@login_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})


@app.route('/api/admin/categories')
@login_required
def admin_categories():
    cats = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in cats])


@app.route('/api/categories')
def categories_data():
    results = db.session.query(
        Category.id,
        Category.name,
        func.count(Product.id).label('product_count')
    ).outerjoin(Product).group_by(Category.id).all()

    categories = []
    for cat_id, cat_name, count in results:
        categories.append({
            "id": cat_id,
            "name": cat_name,
            "product_count": count
        })
    return jsonify(categories)


@app.route('/api/product/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())


# --- Order Placement: Send Email to Admin ---
@app.route('/api/place-order', methods=['POST'])
def place_order():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    address = data.get('address')
    cart_items = data.get('cartItems', [])
    total_price = data.get('totalPrice', 0)

    # Format order details
    order_details = "\n".join(
        [f"{item['name']} (x{item['quantity']}) - Rs {item['price'] * item['quantity']:.2f}" for item in cart_items]
    )

    # Email body
    body = f"""
🛒 New Order Received!

Customer Name: {name}
Email: {email}
Address: {address}

Order Details:
{order_details}

Total: Rs {total_price:.2f}
"""

    try:
        # ✅ Define the email message here
        msg = Message(
            subject="🛍️ New Order from Your Website",
            recipients=['snatchd9@gmail.com'],  # Admin email
            body=body
        )

        # Send the email
        mail.send(msg)
        print("✅ Order email sent successfully!")

        return jsonify({"success": True, "message": "Order placed successfully! Email sent."})

    except Exception as e:
        print("❌ Order email send failed:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# --- Contact Form: Send Email to Admin ---
@app.route('/api/contact-form', methods=['POST'])
def contact_form():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    body = f"""
📩 New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}
"""

    msg = Message(subject=f"📬 Contact Form: {subject}",
                  recipients=['snatchd9@gmail.com'],
                  body=body)
    try:
        mail.send(msg)
        print("✅ Email sent successfully")
    except Exception as e:
        print("❌ Email send failed:", str(e))

    return jsonify({"success": True, "message": "Message sent successfully!"})


# --- Serve Uploaded Images ---
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- Serve Build Images ---
@app.route('/images/<path:filename>')
def serve_build_images(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'build', 'images'), filename)


# --- React Frontend ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')


# --- App Runner ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        if not Category.query.first():
            for name in ["Shoes", "Bottom", "Tops"]:
                db.session.add(Category(name=name))
            db.session.commit()

    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)