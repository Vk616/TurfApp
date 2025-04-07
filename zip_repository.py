#!/usr/bin/env python3
import os
import sys
import subprocess
import shutil
import zipfile
import datetime
import fnmatch
from pathlib import Path

def read_gitignore_patterns():
    """Read and parse .gitignore file to get patterns to ignore."""
    ignore_patterns = []
    
    if os.path.exists('.gitignore'):
        with open('.gitignore', 'r') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if line and not line.startswith('#'):
                    # Convert gitignore pattern to fnmatch pattern
                    # Add ** prefix for directories if not already specified
                    if line.endswith('/'):
                        # It's a directory pattern
                        ignore_patterns.append(line + '**')
                    ignore_patterns.append(line)
    
    return ignore_patterns

def should_ignore(file_path, ignore_patterns):
    """Check if file should be ignored based on gitignore patterns."""
    # Always ignore .git directory
    if '.git/' in file_path or file_path.startswith('.git'):
        return True
        
    # Check each ignore pattern
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(file_path, pattern):
            return True
        # Handle directory patterns
        if pattern.endswith('/') and (file_path.startswith(pattern) or f'/{pattern}' in file_path):
            return True
    return False

def get_files_via_git():
    """Get all tracked files using git command."""
    try:
        result = subprocess.run(['git', 'ls-files'], 
                                stdout=subprocess.PIPE, 
                                stderr=subprocess.PIPE, 
                                text=True, 
                                check=True)
        return [file for file in result.stdout.splitlines() if file.strip()]
    except subprocess.CalledProcessError as e:
        print(f"Error getting files from git: {e}")
        print(f"Error output: {e.stderr}")
        return None
    except FileNotFoundError:
        print("Git command not found. Please ensure git is installed and in your PATH.")
        return None

def walk_and_filter(ignore_patterns):
    """Walk directory and filter files based on gitignore patterns."""
    files_to_include = []
    for root, dirs, files in os.walk('.'):
        # Remove the './' from the beginning of root
        if root.startswith('./'):
            root = root[2:]
        elif root == '.':
            root = ''
            
        # Filter out ignored directories to avoid descending into them
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d), ignore_patterns)]
        
        # Filter files
        for file in files:
            file_path = os.path.join(root, file)
            if not should_ignore(file_path, ignore_patterns):
                files_to_include.append(file_path)
                
    return files_to_include

def zip_repository():
    """Zip repository respecting .gitignore."""
    # Check if we're in a git repository
    if not os.path.isdir('.git'):
        print("Error: Not in a git repository. Please run this script from the root of your git repository.")
        sys.exit(1)
    
    # Get timestamp for filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f"PlayOnTurfApp_{timestamp}.zip"
    
    print(f"Creating ZIP archive '{zip_filename}'...")
    
    # Try to use git for file list (respects .gitignore automatically)
    tracked_files = get_files_via_git()
    
    if tracked_files is None:
        # Fallback to manual directory scanning with gitignore filtering
        print("Using manual file scanning with .gitignore filtering...")
        ignore_patterns = read_gitignore_patterns()
        files_to_zip = walk_and_filter(ignore_patterns)
    else:
        print(f"Found {len(tracked_files)} tracked files with git...")
        files_to_zip = tracked_files
    
    # Create zip file
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            if os.path.exists(file) and os.path.isfile(file):
                print(f"Adding: {file}")
                zipf.write(file)
            else:
                print(f"Skipping non-existent or directory: {file}")
    
    # Get zip file size in MB
    zip_size = os.path.getsize(zip_filename) / (1024 * 1024)
    
    print(f"ZIP archive created successfully: {zip_filename}")
    print(f"Size: {zip_size:.2f} MB")
    print(f"Total files included: {len(files_to_zip)}")

if __name__ == "__main__":
    zip_repository()