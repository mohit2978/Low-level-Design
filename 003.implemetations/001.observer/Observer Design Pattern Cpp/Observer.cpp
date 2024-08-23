#include <iostream>
#include <list>
#include <string>
using namespace std;
class Buyer {
 public:
  virtual ~Buyer(){};
  virtual void notify() = 0;
};

class Shop {
 public:
  void registerBuyer(Buyer* observer) {
    observers.push_back(observer);
  }
  void unregisterBuyer(Buyer* observer) {
    observers.remove(observer);
  }
  void updatedata(int val){
    int prevdata=this->data;
    this->data+=val;
    if(prevdata<0 && this->data >0){
        notifyBuyers();
    }else if(this->data <0){
        cout<<"Not is stock Please try later"<<endl;
    }else {
        cout<<"Now total stock of data is "<<getData();
    }
  }
 int getData(){
    return this->data;
 }
 private:
  list<Buyer *> observers;
  int data=-123;
void notifyBuyers() {
    for (auto observer: observers) observer->notify();
  }
};





class Directcustomer : public Buyer {
private:
 Shop * shop;
 public:
    Directcustomer(Shop *shop){
        this->shop=shop;
    };
    void notify() override {
        cout << "Direct customer Notified\n";
        cout<<"data in direct customer is :"<<shop->getData()<<endl;
    }
};

class Partnercustomer : public Buyer {
private:
Shop* shop;
 public:
    Partnercustomer(Shop * shop){
        this->shop=shop;
    };
    void notify() override {
        cout << "Partners Notified \n";
        cout<<"data in partner customer is :"<<shop->getData()<<endl;
    }
};


int main() {

    Shop* Subject = new Shop;
    Buyer* George = new Directcustomer(Subject);
    Buyer* Xyz_company = new Partnercustomer(Subject);

    Subject->registerBuyer(George);
    Subject->registerBuyer(Xyz_company);

    Subject->updatedata(-12);
    Subject->updatedata(1248);
    std::cout <<  "Unrigester: George " << "\n";
    Subject->unregisterBuyer(George);
    Subject->updatedata(1026);

    delete George;
    delete Xyz_company;

    delete Subject;

}