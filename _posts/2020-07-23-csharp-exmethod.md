---
layout: post
title : C# - Extension Methods
icon: csharp
permalink: /csharp/exmethod
---

`Extension Methods`(확장명 메소드)는 기존의 DataType에서 사용가능했던 메소드를 추가하여 필요한 케이스에 따라 사용할 수 있는 메소드를 만든 것입니다. 프로젝트 중 DataType으로 공통으로 쓸만한 케이스들은 여러가지 DataType의 케이스에 따라서 확장 메소드를 만들 수 있습니다. 확장 메소드를 만들때는 `static`(정적) 메소드로 만들어야 하며 인스턴스화 할 수 없습니다.  
정의 방식은 정의할 함수를 입력한 다음 `this`다음에 확장명 메소드를 추가할 DataType을 입력한 다음 `,` 뒤에 오는 파라미터는 함수 실행시 추가할 파라미터를 입력하면 됩니다.

## Extension Methods

### string

string형식의 변수에 특정글자 이상일 경우 ....처리를 한 확장메소드 입니다. `len`에서 정한 길이만큼 글자를 자르고 `....`를 입력하여 글자를 끊는 확장 메소드입니다.

```csharp
public class ExtMethod
{
    public static string CutStringLength(this string str, int len)
    {
        string txt = string.Empty;

        if (!string.IsNullOrEmpty(str) && str.Length >= len)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(str.Substring(0, len));
            sb.Append("....");

            txt = sb.ToString();
        }

        return txt;
    }

class Program
{
    static void Main(string[] args)
    {
        string str = "Pringles";
        string strValue = str.CutStringLength(4);

        // strValue = Prin....
        Console.WriteLine(strValue);
    }
}
```

### DataRow

DataTable의 값들을 조회할 때 `Column`이 존재하는지 확인한 후 값을 조회하여, `Column`의 부재로 인한 에러를 방지할 수 있는 예시입니다.  
`Column`변수를 추가하여 Row에 해당하는 Column값을 추출할 때 사용할 수 있습니다

```csharp
public static class ExtMethod
{
    public static string GetRowValue(this DataRow row, string column)
    {
        bool isExists = row.Table.Columns.Contains(column);
        string txt = "";

        if (isExists)
        {
            txt = row[column].ToString();
        }

        return txt;
    }
}

class Program
{
    static void Main(string[] args)
    {
        dt.Columns.Add("name", typeof(string));
        dt.Columns.Add("dinner", typeof(string));
        dt.Rows.Add("KimSJ", "Cereal");
        dt.Rows.Add("KooJY", "Salad");

        string rowValue = dt.Rows[0].GetRowValue("dinner");
    }
}
```
