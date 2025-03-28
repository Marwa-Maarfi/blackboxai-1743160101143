import pandas as pd
import json
from typing import Dict, Any

def process_uploaded_file(filepath: str) -> Dict[str, Any]:
    """Process uploaded CSV/JSON file and return structured data"""
    try:
        if filepath.endswith('.csv'):
            df = pd.read_csv(filepath)
        elif filepath.endswith('.json'):
            df = pd.read_json(filepath)
        else:
            raise ValueError("Unsupported file format")
        
        # Basic data analysis
        analysis = {
            'columns': list(df.columns),
            'sample_data': df.head().to_dict(orient='records'),
            'stats': {
                'row_count': len(df),
                'column_count': len(df.columns),
                'numeric_columns': df.select_dtypes(include='number').columns.tolist(),
                'text_columns': df.select_dtypes(include='object').columns.tolist()
            }
        }
        return {'success': True, 'data': analysis}
    except Exception as e:
        return {'success': False, 'error': str(e)}