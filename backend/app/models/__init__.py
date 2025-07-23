# Database Models Package
from app.database import Base

# import all modules in app.models package so their models register
import importlib, pkgutil, pathlib, sys

package = pathlib.Path(__file__).parent
for _, modname, _ in pkgutil.iter_modules([str(package)]):
    if modname.startswith("_"):  # skip private modules
        continue
    importlib.import_module(f"app.models.{modname}")