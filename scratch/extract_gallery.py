import json
import re

transcript_path = r"C:\Users\Likhith Kumar\.gemini\antigravity-ide\brain\b92c5b1d-aa28-4fb7-8107-dd502b5a7007\.system_generated\logs\transcript_full.jsonl"
output_path = r"c:\Users\Likhith Kumar\Downloads\JNTU-REDESIGN\src\data\jntugv-gallery.json"

with open(transcript_path, "r", encoding="utf-8") as f:
    lines = list(f)

d = json.loads(lines[75])
content = d.get("content", "")

# Find all JSON objects within content
obj_pattern = r'\{"id":\d+,[^{}]*?"imglink":"https://api\.jntugv\.edu\.in/dmc/[^{}]*?"\}'

matches = re.findall(obj_pattern, content)
print(f"Found {len(matches)} item matches!")

valid_items = []
for m in matches:
    try:
        item = json.loads(m)
        valid_items.append(item)
    except Exception as e:
        print("Parse error on item:", e)

print(f"Successfully extracted {len(valid_items)} gallery items!")

if valid_items:
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(valid_items, out, indent=2)
    print(f"Saved to {output_path}")
