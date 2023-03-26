const socket = io => {
  io.on("connection", socket => {
    console.log(`connection established by: ${socket.id}`);

    // Video call
    socket.emit("me", socket.id);

    socket.on("leaveCall", () => socket.broadcast.emit("callEnded"));

    socket.on("callUser", data =>
      io.emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      })
    );

    socket.on("answerCall", data => {
      io.to(data.to).emit("callAccepted", data.signal);
    });

    // Broadcasting
    socket.on("broadcast_stream", status =>
      socket.broadcast.emit("broadcast_status", status)
    );

    socket.on("load_broadcast", () =>
      socket.broadcast.emit("get_broadcast_status")
    );

    // Children collection
    socket.on("send_children", () => socket.broadcast.emit("receive_children"));

    // send stream
    socket.on("send_stream", data => {
      socket.broadcast.emit("get_stream", data);
    });

    // receive stream
    socket.on("receive_stream", data => {
      socket.broadcast.emit("receive_stream", data);
    });

    // Candle Bet
    socket.on("join_room", room => socket.join(room));

    socket.on("send_bnbusd1m_status", data =>
      socket.to(data.roomId).emit("receive_bnbusd1m_status", data)
    ); // Sending candle bnbusd1m start
  });
};

module.exports = socket;
