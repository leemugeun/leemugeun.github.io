---
layout: post
title : DI / IOC
icon: spring
permalink: /spring/diioc
---

**DI**와 **IOC**는 Spring환경에서 중요한 개념이며 뜻 풀이로는 다음과 같습니다. DI는 **Dependency Injection(의존성 주입)**이며 IOC는 **Inversion of Control(제어의 역전)** 입니다. 무슨 뜻인지 바로 이해하기엔 어려울 수 있는 개념이며 예제를 통해서 이해하는 것이 빠를 수 있습니다. 객체간의 상호작용만 이해한다면 크게 이해하기 어렵지 않으나 처음 접했을 경우에는 여러번 실습을 통해 이해를 할 필요가 있습니다.

## DI를 적용하지 않은 상태

DI가 적용되지 않은 일반적인 상태는 다음과 같습니다. Submit객체는 getResult함수를 통해 33을 반환하고 있으며 getResult함수를 호출하면 반드시 33이 나오게 되어있습니다. Test함수에서 getResult의 결과값을 얻기 위해 Test클래스는 Submit클래스에 대해 객체의 결과를 받기 위한 의존성을 가지고 있습니다. 이러한 경우를 **Object Dependencies(객체 의존성)**라고 합니다. 그리고 29나 100을 받고싶을 경우에는 Submit클래스 함수 에서 29나 100을 반환하는 함수를 새로 만들어야 하며 Test클래스는 다른 결과값을 받기 위해선 Submit클래스의 다른 함수를 호출해야만 다른 값을 얻을 수 있게되므로 의존성이 강하게 결합되어있다고 볼 수 있습니다.

```java
public interface ISubmit {
    int getResult();
}

public class Submit implements ISubmit {
    public int getResult() {
        return 33;
    }
}

public class Test {
    public static void main(String[] args){
        ISubmit sm = new Submit();

        int result = sm.getResult();

        System.out.println(result);
    }
}
```

이러한 의존성을 해결하기 위해 다음과 같은 방법으로 결합을 하게 하여 객체간의 의존성을 주입하도록 합니다.

## DI의 적용

1 - 생성자를 이용한 의존성 주입

Submit클래스의 변수로 value를 생성했습니다. 이렇게 하게되면 아까와는 다르게 value를 Test클래스에서 원하는 값으로 입력하여 Submit 클래스에서 값을 받아올 수 있게되며 위에서 33의 결과값만 받아올 수 있던 것과는 다르게 원하는 값을 받아올 수 있게되어서 결합도가 느슨해지게 됩니다.

```Java
public interface ISubmit {
    int getResult(int value);
}

public class Submit implements ISubmit {
    private int value;

    public int getResult(int value) {
        return this.value = value;
    }
}

public class Test {
    public static void main(String[] args){
        ISubmit sm = new Submit();

        int result = sm.getResult(100);

        System.out.println(result);
    }
}
```

2 - getter / setter 를 이용한 의존성 주입

SubmitModel객체를 추가 하여 SubmitModel에서 입력한 대로 결과값이 나오도록 의존성 주입을 하였습니다. Submit객체에 SubmitModel생성자를 추가했으며, Submit클래스의 함수에 의해 강한 결합으로 인한 고정적인 값이 받아오는게 아닌, SubmitModel값에 의해 유동적으로 값을 받아 올 수 있는 약한 결합으로 이루어진 프로세스 입니다.  
string / int / decimal 등등과 같은 생성자를 Submit클래스에서 받도록 만들면 생성자가 추가 될 시에 Submit클래스와 ISubmit 인터페이스의 생성자를 추가해줘야 바꿔야 합니다.  하지만 SubmitModel클래스를 생성자로 받아들이게 되면 변수 추가를 할때와는 달리 SubmitModel클래스의 getter/setter값만 추가하면 **Model**객체에만 손을대면 되기에 작업 범위를 줄일 수 있습니다.

```Java
// Model
public class SubmitModel {
    public String name;
    public int year;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}

// Interface
public interface ISubmit {
    int getInsertYear();
    String getInsertName();
}

// Operate Class
public class Submit implements ISubmit {
    private int year;
    private String name;

    public Submit(SubmitModel submitModel) {
        this.year = submitModel.year;
        this.name = submitModel.name;
    }

    public int getInsertYear() {
        return year;
    }

    public String getInsertName() {
        return name;
    }
}

// Main Class
public class Test {
    public static void main(String[] args){

        SubmitModel _submit = new SubmitModel();
        _submit.year = 23;
        _submit.name = "Harim";

        ISubmit sm = new Submit(_submit);

        int year = sm.getInsertYear();
        String name = sm.getInsertName();

        System.out.println(String.valueOf(year) + " " + name);
    }
}
```

## IOC (Inversion Of Control)

IOC라는 것은 제어의 역전이라는 말입니다. 클래스를 제어할 때 클래스 상에서 변수를 넣거나 의존성 설정을 했는데 이러한 설정을 Spring을 이용하여 Xml파일 상에서 제어하게 됩니다. 그래서 사용자가 클래스상에서 하던 의존성 설정을 사용자가 하지않고, Xml파일상에서 이미 의존성 관계가 설정 된 것을 사용자가 받아오게 됨으로 제어권이 Spring을 이용한 Xml파일로 넘어가게 됩니다.  
즉 클래스에서 하던 생성자 설정, 의존관계 설정을 사용하지 않고 Xml파일에 설정된 대로 Spring이 하게된 것을 사용자는 받아오게 됩니다.  
IOC 방식으로 xml에서 설정하게되면 **ApplicationContext(컨테이너)**라는 곳에 들어가게 되는데, 실제로 사용할 때에 xml에 설정한 대로 **ApplicationContext(컨테이너)**에서 설정한 xml대로 꺼내서 쓰기만 하면 됩니다.
위의 코드상에서는 Submit클래스의 변수를 SubmitModel로 받아서 Submit클래스를 제어했지만 이 동작의 제어권을 Spring에 넘겨서 Xml파일로 제어할 수 있습니다. 이렇게 되면 Xml파일 안에서 클래스 제어를 하게 되어 Model클래스의 변수를 넣거나 생성자를 주입할 수 있으며 다음과 같은 방법으로 제어를 역전시킬 수 잇습니다.

```xml
<!-- Xml Bean 설정 (springBean.xml) -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="player" class="com.mgmaven.model.Player" />

    <bean id="mainService" class="com.mgmaven.service.main.MainService" >
        <property name="initPlayer" ref="player" />
    </bean>
</beans>
```

Xml파일에 beans 설정을 했는데 먼저 Player라는 모델을 player라는 bean id로 설정했습니다. 이제 Player클래스 모델을 찾아올때는 player로 설정한 id로 찾아와야 합니다.  
그리고 MainService클래스는 mainService로 bean에서 설정했기 때문에 mainService로 찾아와야 합니다. mainService의 setInitPlayer는 Player를 생성자로 받아왔기 때문에 생성자를 받아오는 ref를 bean내부에 설정한 클래스모델인 player로 설정하여 받아왔습니다.  
이제 MainService클래스는 Player클래스와 DI가 설정된 상태로 xml상에서 제어를 했습니다. 이미 제어를 한 것을 받아오는 방법은 아래의 클래스 함수를 참조바랍니다.

```Java
// Class 파일 설정
// PlayerModel
public class Player {
    @Value("0")
    public int player_id;
    @Value("")
    public String player_name;
    @Value("")
    public String team_id;

    public int getPlayer_id() {
        return player_id;
    }

    public void setPlayer_id(int player_id) {
        this.player_id = player_id;
    }

    public String getPlayer_name() {
        return player_name;
    }

    public void setPlayer_name(String player_name) {
        this.player_name = player_name;
    }

    public String getTeam_id() {
        return team_id;
    }
}

// ServiceClass
public class MainService {

    public Player _player;

    public void setInitPlayer(Player player) {
        this._player = player;
    }

    public Player getAllplayer() {

        return _player;
    }
}

// Controller Class
public class MainController {
    public String test() {

            ApplicationContext ctx = new GenericXmlApplicationContext("classpath:springBean.xml");
            MainService ms = (MainService)ctx.getBean("mainService");
            Player pl = (Player)ctx.getBean("player");

            pl.player_id = 3;
            pl.player_name = "Lee";
            pl.team_id = "K30";

            ms.setInitPlayer(player);
            player = ms.getAllplayer();

            return "default";
        }
}
```

위의 xml에서 설정한 대로 MainController에서 사용하려고 합니다. xml에 의해 설정한 값대로 컨데이너에서 bean을 가져와 쓰는 코드를 작성했습니다. GenericXmlApplicationContext을 이용하여 먼저 bean설정한 xml을 가져 옵니다. ApplicationContext클래스 내부에 보면 BeanFactory가 있습는데 GenericXmlApplicationContext를 이용하여 xml설정한 Bean들을 가져와서 BeanFactory에 담은 것들을 ctx라는 변수로 사용할 준비를 합니다.  
(oooo.xml파일의 경로를 가져올 때 **new ClassPathXmlApplicationContext("oooo.xml")**을 사용하기도 합니다. 그렇지만 **Spring 3.0**이후로 **new GenericXmlApplicationContext("oooo.xml")**방식을 사용하기를 권고 하기 때문에 가급적 **GenericXmlApplicationContext**을 쓰도록 합니다.)

그리고 getBean을 이용하여 위에서 설정한 bean의 id값인 mainService, player를 가져 오는데 getBean이 Object형으로 return하기때문에 형변환을 한번 해줍니다.  
이제 새로 변수로 받은 ms, pl을 위에서 정의한 함수대로 사용할 수 있게됩니다.  
bean에서 MainService의 생성자를 Player로 설정하고 **(DI, IOC)**  
그 설정 된 상태의 bean은 BeanFactory에 담겼으며 **(ApplicationContext 컨테이너)**  
담긴 값들을 사용하는 일련의 과정들에 DI와 IOC가 연계되어있기 때문에 이 개념들은 Spring을 이해하기 위한 기본 개념입니다.
