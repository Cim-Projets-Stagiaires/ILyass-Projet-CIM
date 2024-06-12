from flask import Flask, jsonify # type: ignore
import pandas as pd # type: ignore
import sqlite3

app = Flask(__name__)

# Connect to your database
def connect_db():
    conn = sqlite3.connect('plat_gest_cmd_cim.db')
    return conn

# Example route for submission statistics
@app.route('/api/submission-stats', methods=['GET'])
def submission_stats():
    conn = connect_db()
    df = pd.read_sql_query("SELECT * FROM submission", conn)
    
    total_submissions = df.shape[0]
    submissions_by_status = df['status'].value_counts().to_dict()

    # Calculate average time to approve
    df['date_de_creation'] = pd.to_datetime(df['date_de_creation'])
    df['date_approved'] = pd.to_datetime(df['date_approved'])
    df['time_to_approve'] = (df['date_approved'] - df['date_de_creation']).dt.days
    average_time_to_approve = df['time_to_approve'].mean()

    # Monthly submissions
    df['month'] = df['date_de_creation'].dt.to_period('M')
    monthly_submissions = df['month'].value_counts().sort_index().to_dict()

    result = {
        'total_submissions': total_submissions,
        'submissions_by_status': submissions_by_status,
        'average_time_to_approve': average_time_to_approve,
        'monthly_submissions': monthly_submissions
    }
    
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
