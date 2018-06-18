basic.forever(() => {
    serial.writeValue("T", BMP180.Temperature())
    serial.writeValue("P", BMP180.Press())
    basic.pause(1000)
})