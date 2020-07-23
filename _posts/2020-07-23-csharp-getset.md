---
layout: post
title : C# - Get/Set
icon: Csharp
permalink: /csharp/getset
---

클래스를 인스턴스화 하여 내부의 필드(클래스 또는 구조체에서 직접 선언되는 모든 형식의 변수)와 속성을 할당, 조회할 수 있습니다. 필드와 속성은 접근한정자를 `public`으로 했을 때는 클래스를 인스턴스화 하여 개별 값을 할당, 조회할 수 있습니다. 필드로 선언됐을 경우에는 값 할당, 조회에서 끝나지만 속성이 됐을 때는 값을 함수로 처리하여 유연하게 사용할 수 있게됩니다. 즉, 값 할당, 조회시 메소드처럼 내부에서 사용이 가능하게 되는데 `C#`에서는 필드에 `get`, `set`을 이용해서 속성으로 처리할 수 있습니다.

### Get / Set

아래의 예제를 보면 `seq_no, name, job`은 속성이며, `hobby, _job`은 필드입니다. 필드를 보면 `_job`은 접근한정자가 `private`으로 되어있고 `hobby`는 `public`으로 되어있습니다. `_job`은 클래스를 인스턴스화 한 상태에서 값제어를 할 수 없고 `job`속성 값을 할당하기 위한 필드이며, `hobby`는 값을 제어할 수 있습니다.  
속성으로는 `seq_no, name, job`이 속성인데 `seq_no, name`은 속성으로 선언하고 get, set만 붙였지 아무런 값처리를 하지않고 있습니다. 하지만 `job`속성은 값 할당, 조회시 값 처리를 내부에서 하도록 메소드처럼 구현을 했습니다.

`job`속성에 값을 할당할 경우에는 set하위의 `{}`에 구현된 로직대로 구현이 되며, 값을 가져올 때는 get하위의 {}에 구현된 로직대로 처리하여 값을 return해 줍니다.

```Csharp
public class Custom
{
    private string _job = "";

    public int seq_no { get; set; }
    public string name { get; set; }
    public string hobby = "";

    public string job {
        get {
            if (string.IsNullOrEmpty(_job))
            {
                _job = "JOBLESS";
            }

            return _job;
        }
        set {
            if (value == "PROGAMMER")
            {
                _job = "ENGINEER";
            }
            else
            {
                _job = "ETC JOB";
            }

            _job = value;
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        Custom cs = new Custom();

        // job 속성의 set으로 처리됨
        cs.job = "PROGAMMER";

        // job 속성의 get으로 처리됨
        string job_value = cs.job;
    }
}
```
