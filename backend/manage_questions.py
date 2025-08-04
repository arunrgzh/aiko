#!/usr/bin/env python3
"""
Simple script to manage assessment questions
Usage:
    python manage_questions.py list          # List all questions
    python manage_questions.py add           # Add new question
    python manage_questions.py edit <id>     # Edit question by ID
    python manage_questions.py delete <id>   # Delete question by ID
    python manage_questions.py seed          # Seed default questions
"""

import asyncio
import sys
import json
from typing import Dict, Any

# Add the current directory to the path
sys.path.append('.')

from app.database import get_db
from app.models.assessment import AssessmentQuestion
from sqlalchemy import select

async def list_questions():
    """List all assessment questions"""
    async for db in get_db():
        result = await db.execute(
            select(AssessmentQuestion).order_by(AssessmentQuestion.id)
        )
        questions = result.scalars().all()
        
        print(f"\n📋 Found {len(questions)} assessment questions:\n")
        for q in questions:
            status = "✅ Active" if q.is_active else "❌ Inactive"
            print(f"ID: {q.id} | {status}")
            print(f"Category: {q.assessment_category}")
            print(f"Type: {q.question_type}")
            print(f"Question: {q.question_text[:80]}...")
            print(f"Weight: {q.weight}")
            print("-" * 50)
        break

async def add_question():
    """Add a new assessment question"""
    print("\n📝 Adding new assessment question:")
    
    question_data = {}
    question_data["question_text"] = input("Question text: ")
    question_data["question_type"] = input("Question type (scale/single_choice/multiple_choice): ")
    question_data["assessment_category"] = input("Assessment category: ")
    question_data["weight"] = float(input("Weight (default 1.0): ") or "1.0")
    
    # Get options for choice questions
    if question_data["question_type"] in ["single_choice", "multiple_choice"]:
        options = []
        print("Enter options (empty line to finish):")
        while True:
            option = input(f"Option {len(options) + 1}: ")
            if not option:
                break
            options.append(option)
        question_data["options"] = options
    elif question_data["question_type"] == "scale":
        question_data["options"] = ["1 - Очень плохо", "2 - Плохо", "3 - Средне", "4 - Хорошо", "5 - Отлично"]
    
    question_data["is_active"] = True
    
    async for db in get_db():
        question = AssessmentQuestion(**question_data)
        db.add(question)
        await db.commit()
        await db.refresh(question)
        print(f"✅ Question added with ID: {question.id}")
        break

async def edit_question(question_id: int):
    """Edit an existing assessment question"""
    async for db in get_db():
        result = await db.execute(
            select(AssessmentQuestion).where(AssessmentQuestion.id == question_id)
        )
        question = result.scalar_one_or_none()
        
        if not question:
            print(f"❌ Question with ID {question_id} not found")
            return
        
        print(f"\n📝 Editing question ID {question_id}:")
        print(f"Current text: {question.question_text}")
        
        new_text = input("New question text (or press Enter to keep current): ")
        if new_text:
            question.question_text = new_text
        
        new_category = input(f"New category (current: {question.assessment_category}): ")
        if new_category:
            question.assessment_category = new_category
        
        new_weight = input(f"New weight (current: {question.weight}): ")
        if new_weight:
            question.weight = float(new_weight)
        
        await db.commit()
        print("✅ Question updated successfully")
        break

async def delete_question(question_id: int):
    """Delete an assessment question (soft delete)"""
    async for db in get_db():
        result = await db.execute(
            select(AssessmentQuestion).where(AssessmentQuestion.id == question_id)
        )
        question = result.scalar_one_or_none()
        
        if not question:
            print(f"❌ Question with ID {question_id} not found")
            return
        
        print(f"\n🗑️  Deleting question ID {question_id}:")
        print(f"Text: {question.question_text}")
        
        confirm = input("Are you sure? (y/N): ")
        if confirm.lower() == 'y':
            question.is_active = False
            await db.commit()
            print("✅ Question deleted successfully")
        else:
            print("❌ Deletion cancelled")
        break

async def seed_default_questions():
    """Seed default assessment questions"""
    from scripts.seed_assessment_questions import seed_questions
    await seed_questions()

async def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    
    command = sys.argv[1].lower()
    
    if command == "list":
        await list_questions()
    elif command == "add":
        await add_question()
    elif command == "edit" and len(sys.argv) > 2:
        question_id = int(sys.argv[2])
        await edit_question(question_id)
    elif command == "delete" and len(sys.argv) > 2:
        question_id = int(sys.argv[2])
        await delete_question(question_id)
    elif command == "seed":
        await seed_default_questions()
    else:
        print(__doc__)

if __name__ == "__main__":
    asyncio.run(main()) 