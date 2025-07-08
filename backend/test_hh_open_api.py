"""
Test script for HeadHunter Open API
Демонстрация работы с открытым API HeadHunter без авторизации
"""

import httpx
import asyncio
import json

async def test_hh_vacancies():
    """
    Тестирование поиска вакансий через открытый API HeadHunter
    """
    print("🔍 Тестирование HeadHunter Open API")
    print("=" * 50)
    
    # Параметры поиска
    params = {
        "text": "python",  # Поиск по тексту
        "area": "40",      # Казахстан
        "page": 0,         # Первая страница
        "per_page": 5      # 5 вакансий для теста
    }
    
    try:
        async with httpx.AsyncClient() as client:
            print(f"📡 Запрос: GET https://api.hh.kz/vacancies")
            print(f"🔧 Параметры: {params}")
            print()
            
            response = await client.get(
                "https://api.hh.kz/vacancies",
                params=params,
                headers={
                    "User-Agent": "AI-Komekshi Job Platform Parser"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✅ Успешно! Найдено: {data.get('found', 0)} вакансий")
                print(f"📄 Страниц: {data.get('pages', 0)}")
                print(f"📋 На странице: {len(data.get('items', []))}")
                print()
                
                # Показать первые несколько вакансий
                for i, vacancy in enumerate(data.get('items', [])[:3], 1):
                    print(f"🔸 Вакансия {i}:")
                    print(f"   Название: {vacancy.get('name', 'Не указано')}")
                    print(f"   Компания: {vacancy.get('employer', {}).get('name', 'Не указано')}")
                    print(f"   Зарплата: {format_salary(vacancy.get('salary'))}")
                    print(f"   Город: {vacancy.get('area', {}).get('name', 'Не указано')}")
                    print(f"   URL: {vacancy.get('alternate_url', 'Не указано')}")
                    print()
                
                return True
            else:
                print(f"❌ Ошибка API: {response.status_code}")
                print(f"Ответ: {response.text[:200]}")
                return False
                
    except httpx.RequestError as e:
        print(f"❌ Ошибка сети: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {str(e)}")
        return False

async def test_hh_areas():
    """
    Тестирование получения списка регионов
    """
    print("🌍 Тестирование получения регионов")
    print("=" * 40)
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.hh.kz/areas",
                headers={
                    "User-Agent": "AI-Komekshi Job Platform Parser"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                areas = response.json()
                print(f"✅ Получено {len(areas)} стран/регионов")
                
                # Найти Казахстан
                for area in areas:
                    if area.get("name") == "Казахстан":
                        print(f"🇰🇿 Казахстан (ID: {area.get('id')})")
                        cities = area.get("areas", [])
                        print(f"   Городов: {len(cities)}")
                        for city in cities[:5]:  # Первые 5 городов
                            print(f"   - {city.get('name')} (ID: {city.get('id')})")
                        if len(cities) > 5:
                            print(f"   ... и еще {len(cities) - 5} городов")
                        break
                
                return True
            else:
                print(f"❌ Ошибка API: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Ошибка: {str(e)}")
        return False

def format_salary(salary_data):
    """
    Форматирование зарплаты
    """
    if not salary_data:
        return "Не указана"
    
    salary_from = salary_data.get("from")
    salary_to = salary_data.get("to")
    currency = salary_data.get("currency", "")
    
    if salary_from and salary_to:
        return f"{salary_from:,} - {salary_to:,} {currency}"
    elif salary_from:
        return f"от {salary_from:,} {currency}"
    elif salary_to:
        return f"до {salary_to:,} {currency}"
    else:
        return "Не указана"

async def main():
    """
    Главная функция тестирования
    """
    print("🚀 HeadHunter Open API - Тестирование")
    print("Парсинг открытого API без авторизации")
    print("=" * 60)
    print()
    
    # Тест поиска вакансий
    vacancies_ok = await test_hh_vacancies()
    print()
    
    # Тест получения регионов
    areas_ok = await test_hh_areas()
    print()
    
    # Итоговый результат
    print("📊 Результаты тестирования:")
    print("=" * 30)
    print(f"Поиск вакансий: {'✅ Работает' if vacancies_ok else '❌ Ошибка'}")
    print(f"Получение регионов: {'✅ Работает' if areas_ok else '❌ Ошибка'}")
    
    if vacancies_ok and areas_ok:
        print("\n🎉 Все тесты прошли успешно!")
        print("HeadHunter Open API работает корректно.")
    else:
        print("\n⚠️ Некоторые тесты не прошли.")
    
    print("\n📝 Примеры использования:")
    print("GET https://api.hh.kz/vacancies?text=python&area=40")
    print("GET https://api.hh.kz/vacancies?text=javascript&area=40&page=1")
    print("GET https://api.hh.kz/areas")

if __name__ == "__main__":
    asyncio.run(main()) 