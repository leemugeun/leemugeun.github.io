---
layout: post
title : C# - Class Utility (2) Operator overloading
icon: csharp
permalink: /csharp/operatoroverloading
---

연산자는 일반적으로 변수의 사칙연산이나 bool 처리에 많이 쓰입니다. 그렇지만 특정 클래스에서만 사칙연산을 다르게 표현할 수 있습니다. 클래스 내부에서 특별한 처리를 해줘야 할 때 쓰이는 경우가 있는데 다음과 같습니다

### Operator overloading

연산자 처리를 `OperaterOvl`클래스 내부에서 특정한 연산자들만 오버로드하여 다르게 처리해주고 있으며 내부의 로직이 추가될 경우 상황에 따라 더 추가하여 단순하게 하거나 복잡하게도 구현이 가능합니다. 연산자 오버로딩에서는 `Equals`, `GetHashCode` 함수를 필수적으로 구현해야 합니다.

```csharp
public class OperaterOvl
{
    private string _opVal = "METHOD";
    private int _opNum = 100;

    public static int operator +(OperaterOvl op, int num)
    {
        return op._opNum + num;
    }

    public static int operator -(OperaterOvl op, int num)
    {
        return op._opNum - num;
    }

    public static bool operator ==(OperaterOvl op, string txt)
    {
        return op._opVal == txt;
    }

    public static bool operator ==(string txt, OperaterOvl op)
    {
        return txt == op._opVal;
    }

    public static bool operator !=(OperaterOvl op, string txt)
    {
        return op._opVal == txt;
    }

    public static bool operator !=(string txt, OperaterOvl op)
    {
        return txt != op._opVal;
    }

    // 필수 구현함수
    public override bool Equals(object obj)
    {
        return base.Equals(obj);
    }

    // 필수 구현함수
    public override int GetHashCode()
    {
        return base.GetHashCode();
    }
}

class Program
{
    static void Main(string[] args)
    {
        OperaterOvl op = new OperaterOvl();

        // 결과값 : 200
        int plus = op + 100;

        // 결과값 : 50
        int minus = op - 50;

        // 결과값 : true
        bool okay = op == "METHOD";
        bool okay2 = "METHOD" == op;

        // 결과값 : false
        bool not_okay = op == "CLASS";
        bool not_okay2 = "CLASS" == op;
    }
}
```