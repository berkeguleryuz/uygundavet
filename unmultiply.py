import sys
from PIL import Image

def make_transparent(input_path, output_path):
    print(f"Opening {input_path}")
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        brightness = max(r, g, b)
        if brightness > 0:
            alpha = brightness
            r_new = int((r / alpha) * 255)
            g_new = int((g / alpha) * 255)
            b_new = int((b / alpha) * 255)
            new_data.append((r_new, g_new, b_new, alpha))
        else:
            new_data.append((0, 0, 0, 0))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    make_transparent("public/logo-gold.png", "public/logo-gold-transparent.png")
