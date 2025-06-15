import websocket

def on_message(ws, message):
    print("Received:", message)

ws = websocket.WebSocketApp("wss://fstream.binance.com/ws/!markPrice@arr",
                            on_message=on_message)

# ws = websocket.WebSocketApp("wss://stream.binance.com:443/ws/!markPrice@arr@1s",
#                             on_message=on_message)



ws.run_forever()