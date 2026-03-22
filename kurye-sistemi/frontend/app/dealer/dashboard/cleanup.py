with open('/root/.openclaw/workspace/kurye-sistemi/frontend/app/dealer/dashboard/page.tsx', 'r') as f:
    lines = f.readlines()

# Find the start and end lines to remove
end_line = None

for i, line in enumerate(lines):
    if "{activeMenu === 'couriers'" in line:
        end_line = i
        break

# Remove from line 880 to end_line (0-indexed: 879 to end_line-1)
if end_line:
    new_lines = lines[:880] + lines[end_line:]
    
    with open('/root/.openclaw/workspace/kurye-sistemi/frontend/app/dealer/dashboard/page.tsx', 'w') as f:
        f.writelines(new_lines)
    print(f"Removed lines 880 to {end_line-1}")
else:
    print("end_line not found")
