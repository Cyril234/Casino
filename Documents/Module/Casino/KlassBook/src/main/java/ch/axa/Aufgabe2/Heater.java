package ch.axa.Aufgabe2;

public class Heater {
    private int temperature;
    private int min;
    private int max;
    private int increment;

    public Heater(int temperature, int min, int max, int increment) {
        this.min = min;
        this.max = max;
        setTemperature(5);
        setTemperature(15);
    }
    public int getTemperature() {
        return temperature;
    }
    public void setTemperature(int temperature) {
        this.temperature = temperature;
    }
    public void setIncrement(int increment) {
        this.increment = increment;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public int getIncrement() {
        return increment;
    }

    public int makeWarmer(){
        temperature += 5;
        getMax();
        getMin();
        return temperature;
    }
    public int makeColder(){
        temperature -= 5;
        return temperature;
    }
}
