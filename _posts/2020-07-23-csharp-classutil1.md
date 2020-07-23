---
layout: post
title : C# - Class Utility (1) "This" Method
icon: Csharp
permalink: /csharp/classutil1
---

C#에서 클래스의 특정한 사용형태가 있는데 `this`를 이용한 클래스 사용형태가 있습니다. 메소드 내부에서 `this`를 사용하면 클래스를 지칭하여 클래스 내의 변수를 사용하거나 클래스 자신을 가르켜서 무언가를 하지만 메소드명을 작성하지않고 `this`를 메소드명으로 했을 경우의 사용방식이 있습니다. 이 경우에는 `static`을 이용하여 정적으로 사용할 수 없으며 인스턴스화 시킨 후 사용하여야 합니다. 이 사용방식은 특이하지만 유용하게 사용될 수 있는 방법이며 다음과 같습니다.

### "This" Method

아래의 예시코드는 `return` 타입을 `string`으로 한 함수이며, 인스턴스화 시켰을때 파라미터를 int와 string으로 받는 함수입니다. 이 함수를 구현할때는 반드시 `get`을 이용해서 받는 값에 대해 처리를 해줘야 하며, 사용방법은 `this`메소드 옆에 입력 받을 파라미터 값을 추가해주면 일반 함수와 비슷한 방식으로 사용할 수 있습니다.

사용방법은 인스턴스화 한 변수명에 `[]`로 파라미터를 입력하여 구현한 함수를 사용할 수 있습니다.

```csharp
public class ThisMethod
{
    public string this[int idx]
    {
        get
        {
            string txt = "Not Found";
            List<string> lst = new List<string> { "One", "Two", "Three" };

            if (idx <= lst.Count)
            {
                txt = lst[idx];
            }

            return txt;
        }
    }

    public string this[string key, string sub_key]
    {
        get
        {
            string txt = "Not Found";
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("name", "KwonSK");
            dic.Add("nender", "Men");

            if (!string.isnullorempty(key) && dic.containskey(key.tolower()))
            {
                txt = dic[key];
            }

            return txt;
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        ThisMethod tm = new ThisMethod();

        // 결과값 : Two
        string insert_int = tm[1];

        // 결과값 : KwonSK 입니다.
        string insert_str = tm["name", "입니다"];
    }
}
```
