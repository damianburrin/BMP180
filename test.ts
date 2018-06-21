basic.forever(() => {
    serial.writeValue("T", BMP180.temperature())
    serial.writeValue("P", BMP180.press())
    basic.pause(1000)
})