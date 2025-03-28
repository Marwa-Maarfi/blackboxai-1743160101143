import openai
import json
from typing import Dict, List
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_visualization_recommendations(data: Dict) -> List[Dict]:
    """Generate visualization recommendations using OpenAI API"""
    try:
        prompt = f"""
        Given the following dataset metadata:
        {json.dumps(data, indent=2)}
        
        Suggest 3-5 appropriate visualizations with the following format for each:
        - chart_type: (bar, line, pie, scatter, etc.)
        - x_axis: (column name)
        - y_axis: (column name, if applicable)
        - title: (suggested title)
        - reason: (why this visualization is appropriate)
        
        Include visualizations that highlight Tunisian cultural aspects where relevant.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a data visualization expert with knowledge of Tunisian culture."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        recommendations = json.loads(response.choices[0].message.content)
        return recommendations
    except Exception as e:
        return [{'error': str(e)}]