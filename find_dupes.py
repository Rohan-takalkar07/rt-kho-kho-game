import os
from collections import defaultdict

def find_duplicates(root_dir):
    files_map = defaultdict(list)
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
        for filename in filenames:
            files_map[filename].append(os.path.join(dirpath, filename))

    duplicates = {k: v for k, v in files_map.items() if len(v) > 1}
    
    for filename, paths in duplicates.items():
        print(f"Duplicate: {filename}")
        for path in paths:
            print(f"  - {path}")

if __name__ == "__main__":
    find_duplicates(".")
