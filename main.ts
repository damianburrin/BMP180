/**
* makecode BMP180 digital pressure sensor Package.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * BMP180 block
 */
//% weight=100 color=#30A0C0 icon="\uf042" block="BMP180"
namespace BMP180 {
    let BMP180_I2C_ADDR = 0x77;

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(BMP180_I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getUInt16BE(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.UInt16BE);
    }

    function getInt16BE(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.Int16BE);
    }

    let AC1 = getInt16BE(0xAA)
    let AC2 = getInt16BE(0xAC)
    let AC3 = getInt16BE(0xAE)
    let AC4 = getUInt16BE(0xB0)
    let AC5 = getUInt16BE(0xB2)
    let AC6 = getUInt16BE(0xB4)
    let B1 = getInt16BE(0xB6)
    let B2 = getInt16BE(0xB8)
    let MB = getInt16BE(0xBA)
    let MC = getInt16BE(0xBC)
    let MD = getInt16BE(0xBE)
    let UT = 0
    let UP = 0
    let T = 0
    let P = 0
    let X1 = 0
    let X2 = 0
    let X3 = 0
    let B3 = 0
    let B4 = 0
    let B5 = 0
    let B6 = 0
    let B7 = 0
    let _p = 0

    function measure(): void {
        setreg(0xF4, 0x2E)
        basic.pause(6)
        UT = getUInt16BE(0xF6)
        setreg(0xF4, 0x34)
        basic.pause(6)
        UP = getUInt16BE(0xF6)
    }

    function get(): void {
        measure()
        X1 = (UT - AC6) * AC5 / (1 << 15)
        X2 = MC * (1 << 11) / (X1 + MD)
        B5 = X1 + X2
        T = (B5 + 8) / 160
        B6 = B5 - 4000
        X1 = (B2 * (B6 * B6 / (1 << 12))) / (1 << 11)
        X2 = (AC2 * B6) / (1 << 11)
        X3 = X1 + X2
        B3 = ((AC1 * 4 + X3) + 2) / 4
        X1 = AC3 * B6 / (1 << 13)
        X2 = (B1 * (B6 * B6 / (1 << 12))) / (1 << 16)
        X3 = (X1 + X2 + 2) / 4
        B4 = AC4 * (X3 + 32768) / (1 << 15)
        B7 = (UP - B3) * 50000
        _p = (B7 / B4) * 2
        X1 = (_p / (1 << 8)) * (_p / (1 << 8))
        X1 = (X1 * 3038) / (1 << 16)
        X2 = (-7357 * _p) / (1 << 16)
        P = _p + (X1 + X2 + 3791) / 16
    }

    /**
     * get temperature
     */
    //% blockId="BMP180_GET_TEMPERATURE" block="get temperature"
    //% weight=80 blockGap=8
    export function Temperature(): number {
        get();
        return T;
    }

    /**
     * get pressure
     */
    //% blockId="BMP180_GET_PRESSURE" block="get pressure"
    //% weight=80 blockGap=8
    export function Press(): number {
        get();
        return P;
    }
}