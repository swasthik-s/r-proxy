@echo off
echo Building with Nitro...
set NITRO_PRESET=netlify
call nitropack build

echo Cleaning up problematic files...
for /r .netlify %%f in (*#*) do del "%%f" 2>nul
for /r .netlify %%f in (*?*) do del "%%f" 2>nul

echo Build complete and cleaned!
