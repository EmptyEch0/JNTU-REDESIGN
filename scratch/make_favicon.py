import base64
from PIL import Image, ImageDraw

# Load logo.png
img = Image.open('public/logo.png').convert('RGBA')
size = min(img.size)

# Create circular mask
mask = Image.new('L', (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, size, size), fill=255)

# Crop image to square
left = (img.width - size) // 2
top = (img.height - size) // 2
img_square = img.crop((left, top, left + size, top + size))

# Apply mask
circle_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
circle_img.paste(img_square, (0, 0), mask)

# Save logo-circle.png, favicon.png (256x256) & favicon.ico (64x64)
circle_img.save('public/logo-circle.png')
circle_img.resize((256, 256), Image.Resampling.LANCZOS).save('public/favicon.png')
circle_img.resize((64, 64), Image.Resampling.LANCZOS).save('public/favicon.ico', format='ICO')

# Generate favicon.svg with embedded base64
with open('public/favicon.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="64" fill="#0f172a"/>
  <clipPath id="c">
    <circle cx="64" cy="64" r="64"/>
  </clipPath>
  <image href="data:image/png;base64,{b64}" width="128" height="128" clip-path="url(#c)"/>
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(svg_content)

print("Favicons (favicon.png, logo-circle.png, favicon.ico, favicon.svg) generated successfully!")
