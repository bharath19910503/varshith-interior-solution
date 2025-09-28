from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
import os
from fpdf import FPDF
import time

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['INVOICE_FOLDER'] = 'invoices'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['INVOICE_FOLDER'], exist_ok=True)

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Upload 2D design and generate 3D (placeholder)
@app.route('/upload_design', methods=['POST'])
def upload_design():
    file = request.files['design']
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        # Simulate 3D generation
        time.sleep(2)  # placeholder for processing
        # For demo, just return the uploaded file path
        return jsonify({'status': 'success', 'file': filename})
    return jsonify({'status': 'fail'})

# Generate PDF invoice
@app.route('/generate_invoice', methods=['POST'])
def generate_invoice():
    data = request.get_json()
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "Varshith Interior Solutions", ln=True, align='C')
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 10, "Address: NO 39 BRN Ashish Layout Near Sri Thimmaraya Swami Gudi Anekal - 562106", ln=True)
    pdf.cell(0, 10, "Phone: +91 9916511599 & +91 8553608981", ln=True)
    pdf.cell(0, 10, "Email: Varshithinteriorsolutions@gmail.com", ln=True)
    pdf.ln(5)

    # Table header
    pdf.set_fill_color(0, 128, 0)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(60, 10, "Item", 1, 0, 'C', fill=True)
    pdf.cell(60, 10, "Material Used", 1, 0, 'C', fill=True)
    pdf.cell(20, 10, "Qty", 1, 0, 'C', fill=True)
    pdf.cell(40, 10, "Amount", 1, 1, 'C', fill=True)
    pdf.set_text_color(0, 0, 0)

    for item in data['items']:
        pdf.cell(60, 10, item['name'], 1)
        pdf.cell(60, 10, item['material'], 1)
        pdf.cell(20, 10, str(item['qty']), 1)
        pdf.cell(40, 10, str(item['amount']), 1, ln=True)

    pdf.ln(5)
    pdf.cell(120, 10, f"Total Cost: {data['total']}")
    pdf.cell(0, 10, f"GST: {data['gst']}  Final Cost: {data['final']}", ln=True)
    pdf.ln(5)
    pdf.multi_cell(0, 10, "Note:- 50 pct of the quoted amount has to be paid as advance 30 PCT amount should be paid after completing 50 PCT of work and remaining 20 PCT should be paid at the completing the work")
    
    filename = os.path.join(app.config['INVOICE_FOLDER'], 'invoice.pdf')
    pdf.output(filename)
    return send_file(filename)

if __name__ == '__main__':
    app.run(debug=True)
