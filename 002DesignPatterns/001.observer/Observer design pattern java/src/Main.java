public class Main {
    public static void main(String[] args) {
        Observable observable=new ObservableImpl();
        observable.addObserver(new ObserverImpl(12,"mohit",observable));
        Observer obj=new ObserverImpl(11,"rohit",observable);
        observable.addObserver(obj);
        observable.addObserver(new ObserverImpl(10,"aman",observable));
        observable.changeState(232);
        observable.removeObserver(obj);
        System.out.println("after removing one object -----------------------------");
        observable.changeState(111);
    }
}