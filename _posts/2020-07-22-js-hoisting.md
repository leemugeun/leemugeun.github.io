---
layout: post
title : Hoisting
icon: javascript
permalink: /js/hoisting
---

`Hoisting`이란 JavaScript(이하 JS)에서 변수 선언과 관련된 개념입니다. Hoist의 사전적 뜻으로는 감아올리기, 감아 올리는 장치와 같은 뜻을 가지고 있는데 '끌어 올리다'와 같은 의미를 가지고 있습니다. `Hoisting`이 적용되는 대상은 `var`로 선언한 변수와 `function`입니다. 이 두 대상들은 함수를 선언하기 전에 호출해도 정상적으로 실행이 되는데 `Hoisting`에 의해 이런 현상이 발생하게 됩니다. 그리고 이 현상을 `var hoisting`(변수 선언 끌어올리기), `Function declaration hoisting`(함수선언 끌어올리기)라고 부릅니다. 또한 공식 문서에서는 다음과 같이 표현하고 있습니다.  
\- 호이스팅을 변수 및 함수 선언이 물리적으로 작성한 코드의 상단으로 옮겨지는 것으로 가르치지만, 실제로는 그렇지 않습니다. 변수 및 함수 선언은 컴파일 단계에서 메모리에 저장되지만, 코드에서 입력한 위치와 정확히 일치한 곳에 있습니다.

## Hoisting

아래의 예제를 보면 `var`로 선언한 `txt`와 `i`를 출력하는 예제입니다. console.log로 선언하지 않은 `txt`와 `i`를 출력하게 했는데, 선언되지 않았지만 에러가 나지않고 `undefined`로 출력됩니다. 또한 if문과 for문 안에서만 선언되었던 `txt`와 `i`는 {} 밖에 있는데도 불구하고 선언된 이후에도 사용이 가능하게 됩니다. 그리고 `setFunc`함수가 선언되기 전에 페이지를 로드할 때 호출하도록 했는데, 이것 또한 문제없이 실행됩니다.  
이러한 현상을 `Hoisting`이라고 하는데 공식 문서의 설명대로 변수 및 함수 `선언`은 컴파일 단계에서 메모리에 저장되기 때문에 미리 선언되어서 에러없이 사용할 수 있게됩니다.  

```javascript
// 함수 호출
setFunc();

function setFunc() {
    console.log(txt);
    console.log("for : " + i);

    if (1 != 2) {
        var txt = "Not Matched";
    }

    for (var i = 0; i < 2; i++) {
        console.log(i);
    }

    console.log(txt);
    console.log("for : " + i);

    // Result
    // undefined
    // for : undefined
    // 0
    // 1
    // Not Matched
    // for : 3
}
```

### Hoisting 코드화

`Hoisting`된 모습을 코드화 해본다면 아래와 같은 모양이 될 것 입니다. `txt`와 `i`는 컴파일 단계에서 선언이 되었지만 변수할당이 되지 않았기에 `undefined`로  되었고, `setFunc`함수는 컴파일 단계에서 메모리에 저장되므로 먼저 선언되는 아래와 같은 모습으로 표현될 것입니다. `setFunc`함수 안에서 txt와 i변수가 자유자재로 사용될 수 있는데, 이를 원하지 않을 경우 `let`이나 `const`로 변수를 선언하여 `Hoisting`을 방지할 수 있습니다.

```javascript
function setFunc() {
    // txt와 i가 선언됨
    var txt;
    var i;

    console.log(txt);
    console.log("for : " + i);

    if (1 != 2) {
        // txt변수 할당
        txt = "Not Matched";
    }

    // i변수 할당
    for (i = 0; i < 2; i++) {
        console.log(i);
    }

    console.log(txt);
    console.log("for : " + i);
}

// 함수 호출
setFunc();
```
