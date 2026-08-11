import base64
from PIL import Image, ImageDraw

# Load android-chrome-512x512.png
img = Image.open('public/android-chrome-512x512.png').convert('RGBA')

# Center purple seal
cx, cy = 256, 206
r = 196

left = cx - r
top = cy - r
right = cx + r
bottom = cy + r

cropped = img.crop((left, top, right, bottom))
w, h = cropped.size

mask = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, w, h), fill=255)

circle_img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
circle_img.paste(cropped, (0, 0), mask)

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

print("Perfect circular seal favicon generated successfully!")
