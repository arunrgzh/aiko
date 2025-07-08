#!/usr/bin/env python3

import sys
import json
import traceback

def test_swagger():
    """Test Swagger/OpenAPI schema generation"""
    
    print("Testing Swagger/OpenAPI schema generation...")
    
    try:
        print("1. Importing FastAPI app...")
        from app.main import app
        print("   ✓ App imported successfully")
        
        print("2. Testing OpenAPI schema generation...")
        try:
            openapi_schema = app.openapi()
            print("   ✓ OpenAPI schema generated successfully")
            print(f"   Schema info: {openapi_schema.get('info', {})}")
            print(f"   Paths count: {len(openapi_schema.get('paths', {}))}")
            
            # Check for specific paths that might be problematic
            paths = openapi_schema.get('paths', {})
            problematic_paths = []
            
            for path, methods in paths.items():
                for method, details in methods.items():
                    if 'responses' not in details:
                        problematic_paths.append(f"{method.upper()} {path}")
                    elif not details.get('responses'):
                        problematic_paths.append(f"{method.upper()} {path}")
            
            if problematic_paths:
                print(f"   ⚠️  Paths with potential issues: {problematic_paths}")
            else:
                print("   ✓ All paths have proper response schemas")
            
        except Exception as e:
            print(f"   ❌ OpenAPI schema generation failed: {e}")
            traceback.print_exc()
            return False
        
        print("3. Testing specific router schemas...")
        
        # Test enhanced_jobs router specifically
        try:
            from app.api.enhanced_jobs import router as enhanced_jobs_router
            print("   ✓ Enhanced jobs router imported")
            
            # Check if router has proper response models
            for route in enhanced_jobs_router.routes:
                if hasattr(route, 'response_model') and route.response_model:
                    print(f"   ✓ Route {route.path} has response model: {route.response_model}")
                elif hasattr(route, 'path'):
                    print(f"   ⚠️  Route {route.path} has no response model")
                    
        except Exception as e:
            print(f"   ❌ Enhanced jobs router test failed: {e}")
            traceback.print_exc()
        
        print("4. Testing schema validation...")
        try:
            # Test if we can serialize the schema to JSON
            schema_json = json.dumps(openapi_schema, indent=2)
            print("   ✓ Schema can be serialized to JSON")
            
            # Check schema size (might indicate circular references)
            schema_size = len(schema_json)
            print(f"   Schema size: {schema_size} bytes")
            
            if schema_size > 10_000_000:  # 10MB
                print("   ⚠️  Schema is very large, might have circular references")
            
        except Exception as e:
            print(f"   ❌ Schema validation failed: {e}")
            traceback.print_exc()
            return False
        
        print("\n✅ Swagger/OpenAPI tests successful!")
        return True
        
    except Exception as e:
        print(f"\n❌ Swagger test error: {e}")
        print("\nFull traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_swagger()
    sys.exit(0 if success else 1) 