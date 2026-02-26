import os
import glob
import re

directories = [
    'resources/js/Pages/Admin/**/*.tsx',
    'resources/js/Pages/Company/**/*.tsx',
    'resources/js/Pages/Driver/**/*.tsx',
    'resources/js/Components/**/*.tsx'
]

files = []
for d in directories:
    files.extend(glob.glob(d, recursive=True))

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace indigo -> green
    new_content = content.replace('indigo', 'green')
    # Replace blue -> emerald
    new_content = new_content.replace('blue', 'emerald')
    
    if content != new_content:
        with open(f, 'w') as file:
            file.write(new_content)
        print(f"Updated {f}")

print("Done")
