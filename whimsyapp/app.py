import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, Category, Product
from sqlalchemy import func

app = Flask(__name__)
CORS(app)

# --- Config ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # project root dir
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'db.sqlite3')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# --- Init DB ---
db.init_app(app)

# --- Helpers ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Routes ---

@app.route('/api/')
def home_data():
    return jsonify({"message": "Welcome to the Home page!"})

@app.route('/api/shop')
def shop_data():
    category_name = request.args.get('category')  # e.g. "Bracelet", "Ring", or None
    query = Product.query

    if category_name and category_name.lower() != "all":
        # Join Category and filter by name case-insensitive
        query = query.join(Category).filter(func.lower(Category.name) == category_name.lower())

    products = query.all()
    return jsonify([p.to_dict() for p in products])

@app.route('/api/contact')
def contact_data():
    return jsonify({"email": "contact@yourshop.com", "phone": "123-456-7890"})

# --- Add Product (with Image Upload) ---
@app.route('/api/admin/products', methods=['POST'])
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
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)  # ensure upload folder exists
        image.save(upload_path)
        image_url = f"/static/uploads/{filename}"

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

@app.route('/api/admin/categories')
def admin_categories():
    cats = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in cats])

@app.route('/api/product/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

# --- Delete Product ---
@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})

# --- Debugging routes ---
@app.route('/api/debug/categories')
def debug_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])

@app.route('/api/debug/products_invalid_category')
def debug_invalid_category():
    products = Product.query.filter(~Product.category.has()).all()
    return jsonify([p.to_dict() for p in products])


# --- Serve React Frontend ---

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # React build folder path relative to this file
    react_build_dir = os.path.abspath(os.path.join(BASE_DIR, '..', 'firstapp', 'build'))

    if path != "" and os.path.exists(os.path.join(react_build_dir, path)):
        return send_from_directory(react_build_dir, path)
    else:
        return send_from_directory(react_build_dir, 'index.html')


# --- Setup & Run ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        # Create upload folder if not exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        # Ensure categories exist (only seed if empty)
        if not Category.query.first():
            categories = ["Ring", "Earring", "Bracelet"]
            for name in categories:
                db.session.add(Category(name=name))
            db.session.commit()

    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
