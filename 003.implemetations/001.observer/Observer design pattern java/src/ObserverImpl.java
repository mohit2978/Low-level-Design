public class ObserverImpl implements Observer{
    int id;
    String name;
    Observable observable;

    public ObserverImpl(int id, String name, Observable observable) {
        this.id = id;
        this.name = name;
        this.observable = observable;
    }

    @Override
    public void update() {
        System.out.println("Observer id : "+this.id+" name : "+this.name);
        System.out.println("the new value is : "+observable.getData());
    }
}
