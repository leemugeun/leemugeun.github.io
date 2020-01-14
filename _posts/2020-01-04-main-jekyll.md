---
layout: post
title : main
postname: main
---
개인적으로 Blog를 갖고싶은 경우 Naver, Daum, Tistory 등을 이용하여 블로그를 꾸미거나 웹 호스팅을 하여 자신만의 블로그를 꾸며나갈 수 있습니다. 하지만 플랫폼 내에서 블로그를 만들경우 본인이 원하는대로 디자인을 꾸미기보다는 주어진 방식 내에서 해결해야 하며, 웹 호스팅을 할 경우에는 추가적인 비용이 듭니다. `Jekyll`을 이용하여 **Github 블로그**를 만들면 DB나 웹서버를 이용할 수는 없지만 정적인 자신만의 웹사이트를 만들 수 있으며 웹사이트를 마음대로 꾸며나갈 수 있습니다.

## Github 블로그 생성

Github의 기능으로 간단히 개인 블로그를 만들 수 있는데 `Jekyll`이라는 정적 웹페이지 만드는 방식을 사용하여 웹호스팅 비용없이 개인 웹사이트(?)를 만들 수 있습니다. 그러기 위해선 `Jekyll`을 먼저 설치해 줍니다.  
`Jekyll` 은 **[Markdown][link-Markdown]** 파일로 컨텐츠를 작성하고 **[Html/Css/Javascript][link-Front]**을 사용할 수 있으며 **[Liquid][link-Liquid]** 문법으로 템플릿 제어를 할 수 있으며 데이터 **.yml/.json/.csv**와 같은 확장자의 데이터를 불러 올 수 있습니다.  
`Jekyll`을 이용하여 블로그 생성시 Github블로그 생성을 먼저 해야하는데 아래의 **New**버튼을 눌러서 새 **Repository**를 만듭니다
![Git]({{ site.files}}/Jekyll/git_blog.png)  

새 블로그 생성시 **username.github.io** 형태의 url로 자신의 블로그 url이 형성됩니다  
새 **Repository** 생성시 **username**으로 하셔야 정상적으로 Github 블로그 사용이 가능합니다  
**Public**으로 설정하시면 언제어디서나 접근이 가능하며, **README**는 누군가가 Github접근시 안내를 위한 안내장(?) 정도로 보면 됩니다.
![Git]({{ site.files}}/Jekyll/git_blog_create.png)

**`README.md의 용도`**
![Git]({{ site.files}}/Jekyll/git_blog_readme.png)  

## Ruby 환경구성

Jekyll은 Ruby개발환경에서 작업할 수 있으므로 Ruby를 설치해 줍시다.  
설치시 버전문제가 생기는 경우가 있으므로 `=>` 표시가 있는 버전을 설치하도록 합시다.(x64:64비트, x86:32비트)  
`설치시 C드라이브 및 경로에 설치를 권장합니다.(D혹은 기타 드라이브 설치시 정상적으로 작동이 되지 않을 수 있습니다)`  
설치링크 : [Download Ruby Installer][link-Ruby]  
![Ruby]({{ site.files}}/Jekyll/ruby_install.png)  

설치가 완료되면 아래와 같은 Ruby Command 창이 나타나며 1, 2, 3 모두 실행합니다

![Ruby]({{ site.files}}/Jekyll/ruby_install_cmd.png)

정상적으로 Ruby가 설치가 되었는지 확인을 해 봅시다

```console
ruby -v

gem -v
```

![Ruby]({{ site.files}}/Jekyll/ruby_gem_info.png)

간혹 Jekyll 설치시 gem으로 인한 문제가 발생하기 때문에 Gem을 Update시켜줍니다  

```console
gem update
```

![Ruby]({{ site.files}}/Jekyll/ruby_gem_update.png)

## Jekyll 설치

Ruby를 설치를 마쳤기때문에 이제 `Jekyll`을 설치해줍시다. 실행 -> CMD로 실행창에서 아래 커맨드를 바로 수행하면 설치가 가능합니다
RubyGems을 통해 Jekyll과 Bundler를 설치합니다  
(Bundler는 로컬을 Ruby개발환경으로 만들 수 있게 도와줍니다)

```console
gem install jekyll bundler
```

![Jekyll]({{ site.files}}/Jekyll/jekyll_install.png)

잘 설치 되었나 확인차 확인한번 해보도록 합시다

```console
jekyll -v
```

![Jekyll]({{ site.files}}/Jekyll/jekyll_info.png)

설치를 마쳤으면 기본 Jekyll 사이트구성을 만듭니다  
Github 블로그를 만들거기 때문에 **leemugeun.github.io**로 생성하겠습니다

```console
jekyll new leemugeun.github.io
```

![Jekyll]({{ site.files}}/Jekyll/jekyll_new.png)

## Jekyll 로컬환경 구동

`Jekyll new` Command를 이용하여 만든 폴더를 경로로 하고 Command창을 엽니다  
그리고 로컬환경에서 Jekyll을 이용한 웹사이트를 만들경우 미리보기 서버로 사이트를 빌드합니다.
Ctrl + C 로 구동된 미리보기 서버를 종료할 수 있습니다.

```console
bundle exec jekyll serve
```

![Jekyll]({{ site.files}}/Jekyll/jekyll_serve_start.png)

위 커맨드를 이용하여 사이트를 빌드하여 아래 Url로 이동하여 스크린샷과 같은 화면이 나오면 정상적으로 Jekyll설치를 마쳤습니다.  
(Ruby환경은 로컬 호스트에 4000번 포트를 사용합니다)

```console
http://localhost:4000/
```

![Jekyll]({{ site.files}}/Jekyll/jekyll_main.png)

새로 생성된 `Jekyll`웹을 개발하기위한 초기세팅은 끝났으며, 환경구성을 위해서는 개발툴(IDE)을 설치를 해야하는데 **Visual Studio Code**로 개발이 가능합니다. Git을 설치한 후 **Visual Studio Code**에 연결하여 Pull Push를 이용해 Github에 저장된 Repository에 작업사항을 관리하며 자신만의 Github Blog를 꾸며나갈 수 있습니다.  
**Download Visual Studio Code: <https://code.visualstudio.com/download>

## Jekyll/Web/Markdown Reference

`Jekyll`을 이용하기전에 아래 강의를 처음부터 끝까지 한번들어보기를 권장합니다. (영어 자막을 켜고 보면 유용합니다)  
**Jekyll Tutorial** : <https://www.youtube.com/watch?v=T1itpPvFWHI&list=PLLAZ4kZ9dFpOPV5C5Ay0pHaa0RJFhcmcB&index=1>

아래는 `Jekyll`개발을 유용하게 하기위한 참고 Url입니다.  
개발중 어려움이 있을 경우 Url에서 참고 바랍니다

Jekyll Reference : <https://jekyllrb-ko.github.io/>  
Liquid Syntax : <https://www.markdownguide.org/basic-syntax/>  
Markdown Systax : <https://www.markdownguide.org/basic-syntax/>, <https://docs.microsoft.com/ko-kr/contribute/how-to-write-use-markdown>  
Markdown code highlight : <https://highlightjs.org/download/>  
Front-end guide : <https://poiemaweb.com/>

[link-Markdown]: https://www.markdownguide.org/basic-syntax
[link-Front]: https://poiemaweb.com/
[link-Liquid]: https://help.shopify.com/en/themes/liquid/basics
[link-Ruby]: https://rubyinstaller.org/downloads/
[link-VS-Code]: https://code.visualstudio.com/download
[link-jekyll-video]: https://www.youtube.com/watch?v=T1itpPvFWHI&list=PLLAZ4kZ9dFpOPV5C5Ay0pHaa0RJFhcmcB&index=1
