import os
from collections import defaultdict

def analyze_repo(root_dir):
    empty_files = []
    empty_dirs = []
    file_map = defaultdict(list)
    
    # Walk top-down so we can identify empty dirs
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        # Skip node_modules and .git
        if 'node_modules' in dirpath.split(os.sep) or '.git' in dirpath.split(os.sep):
            continue
            
        # Check files
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            try:
                size = os.path.getsize(filepath)
                if size == 0:
                    empty_files.append(filepath)
                else:
                    # check for whitespace only content
                    with open(filepath, 'rb') as f:
                        if not f.read().strip():
                            empty_files.append(filepath)
                            size = 0
                
                if size > 0:
                    key = filename.lower()
                    file_map[key].append({
                        'path': filepath,
                        'size': size
                    })
            except Exception as e:
                pass # skip errors
        
        # Check if dir is empty (after ignoring we might have empty dirs if we delete files, 
        # but here we just check if it has no files/dirs currently)
        # However, os.walk lists contents. If !filenames and !dirnames -> empty
        if not filenames and not dirnames:
             empty_dirs.append(dirpath)

    print("=== EMPTY FILES ===")
    for f in empty_files:
        print(f)
        
    print("\n=== EMPTY DIRECTORIES ===")
    for d in empty_dirs:
        print(d)
        
    print("\n=== DUPLICATES ===")
    for filename, entries in file_map.items():
        if len(entries) > 1:
            print(f"Name: {filename}")
            for e in entries:
                print(f"  - {e['path']} ({e['size']} bytes)")

if __name__ == "__main__":
    analyze_repo(".")
