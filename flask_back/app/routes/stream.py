from flask import Blueprint, Response, request, current_app, stream_with_context
import queue

stream_bp = Blueprint('stream', __name__, url_prefix='/stream')

def get_message_queue():
    if not hasattr(current_app, 'message_queue'):
        current_app.message_queue = queue.Queue()
    return current_app.message_queue

def sse_event_stream():
    q = get_message_queue()
    while True:
        message = q.get()
        yield f"data: {message}\n\n"

@stream_bp.route('/')
def stream():
    return Response(stream_with_context(sse_event_stream()), mimetype='text/event-stream')

@stream_bp.route('/trigger_update', methods=['POST'])
def trigger_update():
    data = request.get_json()
    message = data.get('message', 'Update!')
    q = get_message_queue()
    q.put(message)
    return {"status": "message queued"}