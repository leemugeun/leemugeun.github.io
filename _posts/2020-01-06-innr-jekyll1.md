---
layout: post
title : innr_jekyll
postname: Jekyll
permalink: /jekyll/init
---
> ## **Github 블로그 생성**

Github의 기능으로 간단히 개인 블로그를 만들 수 있는데 `Jekyll`이라는 정적 웹페이지 만드는 방식을 사용하여 웹호스팅 비용없이 개인 웹사이트(?)를 만들 수 있습니다. 그러기 위해선 `Jekyll`을 먼저 설치해 줍니다.

`Jekyll` 은 **[Markdown][link-Markdown]** 파일로 컨텐츠를 작성하고 **[Html/Css/Javascript][link-Front]**을 사용할 수 있으며 **[Liquid][link-Liquid]** 문법으로 템플릿 제어를 할 수 있습니다.
데이터 **.yml/.json/.csv**와 같은 확장자의 데이터를 불러 올 수 있습니다.

<br />
<br />

`Jekyll`을 이용하여 블로그 생성시 Github블로그 생성을 먼저 해야하는데 아래의 **New**버튼을 눌러서 새 **Repository**를 만듭니다

![Git]({{ site.files}}/Jekyll/git_blog.png "Git")

<br />
<br />

새 블로그 생성시 **username.github.io** 형태의 url로 자신의 블로그 url이 형성됩니다

새 **Repository** 생성시 **username**으로 하셔야 정상적으로 Github 블로그 사용이 가능합니다

**Public**으로 설정하시면 언제어디서나 접근이 가능하며, **README**는 누군가가 Github접근시 안내를 위한 안내장(?) 정도로 보면 됩니다.

![Git]({{ site.files}}/Jekyll/git_blog_create.png "Git")

<br />
<br />

# `README.md의 용도`

![Git]({{ site.files}}/Jekyll/git_blog_readme.png "Git")

<br />
<br />

> ## **Ruby 환경구성**

Jekyll은 Ruby개발환경에서 작업할 수 있으므로 Ruby를 설치해 줍시다.

설치시 버전문제가 생기는 경우가 있으므로 **=>** 표시가 있는 버전을 설치하도록 합시다.
(x64:64비트, x86:32비트)

`설치시 C드라이브 및 경로에 설치를 권장합니다.(D혹은 기타 드라이브 설치시 정상적으로 작동이 되지 않을 수 있습니다)`

설치링크 : [Ruby Installer][link-Ruby]

![Ruby]({{ site.files}}/Jekyll/ruby_install.png "Ruby")

<br />

설치가 완료되면 아래와 같은 Ruby Command 창이 나타나며 1, 2, 3 모두 실행합니다

![Ruby]({{ site.files}}/Jekyll/ruby_install_cmd.png "Ruby")

<br />

정상적으로 Ruby가 설치가 되었는지 확인을 해 봅시다




[link-Markdown]: https://www.markdownguide.org/basic-syntax
[link-Front]: https://poiemaweb.com/
[link-Liquid]: https://help.shopify.com/en/themes/liquid/basics
[link-Ruby]: https://rubyinstaller.org/downloads/