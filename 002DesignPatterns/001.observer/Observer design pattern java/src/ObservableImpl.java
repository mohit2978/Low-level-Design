import java.util.ArrayList;
import java.util.List;

public class ObservableImpl implements Observable{
    List<Observer> list=new ArrayList<>();
    int data =0;
    @Override
    public void addObserver(Observer observer) {
        list.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
            list.remove(observer);
    }

    @Override
    public void notifyObserver() {
        for(Observer observer:list){
            observer.update();
        }
    }

    @Override
    public void changeState(int val) {
        data=val;
        notifyObserver();
    }

    public int getData() {
        return data;
    }
}
