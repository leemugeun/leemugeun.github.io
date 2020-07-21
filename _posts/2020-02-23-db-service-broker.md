---
layout: post
title : (MSSQL)Service Broker
icon: db
permalink: /db/msservicebroker
---

`서비스 브로커(Service Broker)`는 데이터베이스 엔진에서 두 개의 서로 다른 응용 프로그램 간에 일반적으로 명령 메시지인 태스크의 완료를 모니터링하는 SQL Server 의 기능입니다. 메시지 전달을 한쪽 끝에서 다른 쪽 끝까지 안전하게 할 책임이 있으며, 대상 응용 프로그램이 일시적으로 종료되거나 응답하지 않는 경우, Service Broker는 전송 준비가 될 때까지 메시지를 큐에 저장해 놓습니다.  
`두 애플리케이션(SQL Server 내부 또는 외부)`이 통신할 때, 어느 애플리케이션도 반대쪽 끝의 기술 세부사항에 접근할 수 없습니다. 민감한 메시지를 보호하고 지정된 장소에 안정적으로 전달하는 것이 `Service Broker`의 역할입니다. `Service Broker`는 고도로 통합되어 있으며, 메시지 전달 및 처리에 대한 강력한 보증과 함께 메시지 송수신을 위한 간단한 Transact-SQL 인터페이스를 제공합니다. 이니시에이터 프로그램(대화를 시작하는 프로그램)은 대상 애플리케이션(수신기) 주소와 함께 서비스 브로커에게 메시지를 전송한다. 대상 애플리케이션은 메시지를 수신한 후 표시기 어플리케이션에 의 성공적인 전달을 나타내는 승인 또는 응답 메시지를 전송합니다. `Service Broker`로 전달할 메시지 타입은 `Xml`로 고정하거나 `일반문자열`로 할 수 있습니다

`Service Broker`의 Message Type, Contract, Queue, Service의 네이밍은 하고싶은 대로 해도 되지만 권고 사항은 API형태의 Url로 네이밍을 처리하기를 권고하고 있습니다. API형태의 Uri는 실제로 접속할수 없는 사이트여도 상관없으며 단순히 네이밍을 위한 것이기 때문에 편한대로 만들면 됩니다.  
여기서는 `http://www.lmgproject.com/InsideDemos/`을 네이밍 규칙으로 지정하여 만들겠습니다. 이 Url은 존재하지 않으며 접속도 불가능한 Url 입니다.

`Service Broker`를 이해하기 위해선 다음의 개념을 잘 알아야 합니다.  
**Service(서비스)** : 메시지를 전달하기 위한 통신매개 수단 / Contract조건에 맞는 Message Type으로 전달합니다  
**Queue(큐)** : 메시지를 전달받아 저장해놓는 장소(테이블 같은 존재) / Contract조건에 맞게 처리된 메시지를 받습니다  
**Contract(계약)** : 메시지를 전송자와 수신자를 설정해놓는 계약(`Servie Broker`수행시 메시지간의 계약에 의해 데이터가 처리됩니다)  
**Message(메시지)** : 통신하면서 주고받을 메시지(Xml데이터) 입니다. 송/수신할 메시지 타입을 결정할 수 있습니다(Ex - Xml, None)

## Start Service Broker(Example)

Service Broker의 실행방식은 두 Service간의 통신이며(Ex - A, B) A Service에 종속된 Queue의 값을 B Service로 보내서 B Service에 종속된 Queue에 데이터를 전달하는 것 입니다.  
통신시에 전달되는 Message는 Contract에서 설정한 송신자(initiator)와 수신자(target)의 계약내용을 따릅니다.  

아래의 작업실행시 DB하위의 Service Broker폴더의 메시지유형(Message), 계약(Contract), 큐(Queue), 서비스(Service)폴더에서 확인이 가능합니다. 각 내용을 생성시 실시간으로 보여지지 않으므로 DB에 우클릭 후 **새로고침**을 클릭 한 후에 다시 폴더로 가서 확인해 봅니다.  

## Use Service Broker

Service Broker를 사용함으로 변경합니다. DB생성시 기본값은 사용안함으로 설정되어있습니다.

```sql
alter database project set enable_broker
```

## Create Message Type

Service Broker로 사용할 메시지의 이름을 생성하며 **validation**설정으로 타입을 고정할 수 있습니다.  
well_formed_xml로 타입을 설정하면 xml로 타입이 고정됩니다.  

**Message Type** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-message-type-transact-sql?view=sql-server-ver15][sb-message-type]

```sql
--Message Type 생성
create message type [http://www.lmgproject.com/InsideDemos/PlayerAsyncRequest]
--validation = well_formed_xml;
go

create message type [http://www.lmgproject.com/InsideDemos/PlayerAsyncResult]
--validation = well_formed_xml;
go
```

## Create Contract

메시지를 주고받는 Contract를 생성합니다.  
아래의 계약내용에 따르면 `~/PlayerAsyncRequest`가 전송하는 메시지 이며 `~/PlayerAsyncResult`가 수신하는 메시지 입니다.  

**Create contract** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-contract-transact-sql?view=sql-server-ver15][sb-create-contract]

```sql
--Contract 생성
create contract [http://www.lmgproject.com/InsideDemos/PlayerAsyncContract]
                (
                    [http://www.lmgproject.com/InsideDemos/PlayerAsyncRequest] sent by initiator,
                    [http://www.lmgproject.com/InsideDemos/PlayerAsyncResult]  sent by target
                )
go
```

## Create Queue/Service

Queue와 Service를 생성하여 직접 통신할 수 있는 수단을 만듭니다.  
Queue와 Service는 1:1로 매칭되며 1개의 Service에 처리될 1개의 Queue를 설정합니다.  
`~/PlayerProcessingService` Service에서는 `~/PlayerAsyncContract` Contract를 추가하였는데, 해당 Queue에서 `~/PlayerRequestService` Service를 받기 때문에 송/수신 Contract내용을 추가했습니다

**Create queue** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-queue-transact-sql?view=sql-server-ver15][sb-create-queue]  
**Create service** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-service-transact-sql?view=sql-server-ver15][sb-create-service]

```sql
--Request Queue생성
create queue Basic_PlayerRequestQueue;
go

--Request Queue의 Service생성
create service [http://www.lmgproject.com/InsideDemos/PlayerRequestService]
on queue Basic_PlayerRequestQueue;
go

--Processing Queue생성
create queue Basic_PlayerProcessingQueue;
go

--Processing Queue의 Service생성
create service [http://www.lmgproject.com/InsideDemos/PlayerProcessingService]
on queue Basic_PlayerProcessingQueue ([http://www.lmgproject.com/InsideDemos/PlayerAsyncContract])
go
```

## Execute Service Broker(Begin Dialog)

위의 스크립트로 Message, Contract, Queue, Service를 생성하였으므로 `~/PlayerRequestService`에서 `~/PlayerProcessingService`로 메시지를 전송하는 스크립트를 작성하면 다음과 같이 됩니다.  
이렇게 되면 `~/PlayerProcessingService`로 통신요청을 했기 때문에 이 Service에 해당하는 Queue(Basic_PlayerProcessingQueue)로 데이터를 받아오며, Select문으로 이 내용을 확인해볼 수 있습니다.  
메시지를 전송하기 때문에 Message Type을 **~/PlayerAsyncRequest**로 설정했습니다.  
**@handle**값은 두 Service간의 통신내용을 담고있으며, Servie를 제어할 수 있는 값입니다. begin dialog @handle ~... 로 서비스 통신을 핸들링하는 내용을 설정했습니다.  

이 실행문은 하나의 `Stored Procedure(SP)`로 만들어서 사용할 수 있습니다.

**Begin dialog** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/begin-dialog-conversation-transact-sql?view=sql-server-ver15][sb-begin-dialog]

```sql
--Request Message 전송
begin
    declare @handle uniqueidentifier;
    declare @msg nvarchar(max) = '';

    begin dialog @handle
        from service [http://www.lmgproject.com/InsideDemos/PlayerRequestService]
        to service N'http://www.lmgproject.com/InsideDemos/PlayerProcessingService'
        on contract [http://www.lmgproject.com/InsideDemos/PlayerAsyncContract]
        with encryption = off;

        set @msg = @msg + '<mgp>';

        set @msg = @msg + convert(nvarchar(max),
            (
                select 1 as tag
                    ,   null as parent
                    ,   player_id as [player!1!player_id]
                    ,   player_name as [player!1!player_name]
                    ,   nickname as [player!1!nickname]
                    ,   back_no as [player!1!back_no]
                from project.dbo.player with(nolock)
                where player_id in (2000001, 2000002, 2000003)
                for xml explicit
            ));

            set @msg = @msg + '</mgp>';

            send on conversation @handle message type [http://www.lmgproject.com/InsideDemos/PlayerAsyncRequest]
        (
            @msg
        );
end
```

## Declared @msg parameter contents

```xml
<player player_id="2000001" player_name="김태호" nickname="" back_no="0" />
<player player_id="2000002" player_name="정상수" nickname="" back_no="0" />
<player player_id="2000003" player_name="유동우" nickname="" back_no="40" />
```

## Select Queue information

Request Message 주석 실행문을 실행 했다면 Basic_PlayerProcessingQueue에 내용이 담겨있는데 다음과 같이 Queue의 내용을 확인해 볼 수 있으며, 내용은 다음과 같을 것입니다.  
service_name(Queue에 매칭된 Service) : ~/InsideDemos/PlayerProcessingService  
service_contract_name(통신시 이루어 진 Contract) : ~/InsideDemos/PlayerAsyncContract  
message_type_name(송신한 Message 이름) : ~/InsideDemos/PlayerAsyncRequest  
message_body(Message 내용 - @msg): 0x3C006D0067007...

```sql
select *
from dbo.Basic_PlayerProcessingQueue;
```

@msg값은 player태그가 있는 xml형식인데  message_body값을 보니 Service Broker에 의해 암호화되어서 알수가 없게되었습니다.  
Service Broker 내부적으로 자체암호화해서 전송하기 때문에 다음과 같은 방법으로 cast해서 데이터 확인이 필요합니다.  
@msg의 Datatype을 nvarchar(max)로 했기때문에 형을 맞추기 위해 nvarchar(max)로 cast했는데 xml로 cast해도 무방합니다.

```sql
select cast(message_body as nvarchar(max)), *
from dbo.Basic_PlayerProcessingQueue

select cast(message_body as xml), *
from dbo.Basic_PlayerProcessingQueue
```

## Processing requested queue information(Waitfor / Receive)

Service로 전송된 Queue의 값을 실제로 처리하기 위해선 다음과 같이 처리할 수 있는데 일방적으로 보내기만 하면 되는 상황이라면 `send on conversation ~ );`부분을 빼고 Select, Insert, Update 등의 작업을 수행하는 쿼리를 만들면 됩니다.  
아래의 실행문은 수신한 Service에서 송신한 Service로 답을 보내기 위한 방법입니다.  
이 실행문에서는 @handle에 의해 `~/PlayerAsyncResult`메시지로 수신 Service에서 송신 Service로 다시 요청합니다.  

하나의 프로시저로 만들어서 작업을 하시면 작업하기 편리합니다.

**Waitfor / Receive** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/receive-transact-sql?view=sql-server-ver15][sb-waitfor-receive]

```sql
create procedure [dbo].[mg_set_broker_processing_player_info]
as
set nocount on
set transaction isolation level read uncommitted
begin
    declare @conversation_handle uniqueidentifier;
    declare @message_body nvarchar(max);
    declare @message_type_name sysname;

    waitfor
    (
        receive
            @conversation_handle = conversation_handle,
            @message_body = cast(message_body as nvarchar(max)),
            @message_type_name = message_type_name
        from Basic_PlayerProcessingQueue
    ), timeout 200;

    if (@message_type_name = N'http://www.lmgproject.com/InsideDemos/PlayerAsyncRequest')
    begin
        declare @reply_message_body nvarchar(max) = @message_body;

        send on conversation @conversation_handle message type [http://www.lmgproject.com/InsideDemos/PlayerAsyncResult]
        (
            @reply_message_body
        );

    end

    else if (@message_type_name = N'http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog')
    begin
        end conversation @conversation_handle
    end

    else if (@message_type_name = N'http://schemas.microsoft.com/SQL/ServiceBroker/Error')
    begin
        end conversation @conversation_handle
    end
end
```

## Processing replied queue information(Waitfor / Receive)

위의 mg_set_broker_processing_player_info SP실행시에 다시 `~/PlayerRequestService`로 요청한 데이터를 처리를 해보겠습니다.  
아래의 실행문을 실행하게 되면 SQL Server에 내장된 로그에 결과를 보여줄 수 있도록 만들며 처리방식은 위의 SP와 동일합니다.  
이 실행문을 실행하게 되면 raiserror로 `Processing completed.`문구로 로그를 저장하는데 내장된 `exec xp_readerrorlog`를 실행하여 `Processing completed.`문구를 확인해 볼 수 있습니다.  

```sql
create procedure [dbo].[mg_set_broker_request_player_info]
as
set nocount on
set transaction isolation level read uncommitted
begin
    declare @conversation_handle uniqueidentifier;
    declare @message_body nvarchar(max);
    declare @message_type_name sysname;

    waitfor
    (
        receive top(1)
            @conversation_handle = conversation_handle,
            @message_body = cast(message_body as nvarchar(max)),
            @message_type_name = message_type_name
        from Basic_PlayerRequestQueue
    ), timeout 200;

    if (@message_type_name = N'http://www.lmgproject.com/InsideDemos/PlayerAsyncResult')
    begin
        declare @result nvarchar(50) = N'Processing completed.';

        raiserror(@result, 10, 1) with log
    end

    else if (@message_type_name = N'http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog')
    begin
        end conversation @conversation_handle
    end

    else if (@message_type_name = N'http://schemas.microsoft.com/SQL/ServiceBroker/Error')
    begin
        end conversation @conversation_handle
    end
end
```

## Add Stored Prodecure on Queue

위의 방법으로는 송신 Service -> 수신 Service로 메시지 전송시 수동으로 mg_set_broker_processing_player_info를 실행해서 Queue의 Message를 처리했습니다.  
하지만 Queue에 SP를 저장해 놓음으로써 Service요청이 올 경우 Queue에 Message가 담기면 바로 처리하도록 설정 할 수 있는데 Service -> Serivce로 요청시 알아서 데이터 처리가 되도록 할 수 있는 방법입니다.  

**procedure_name**으로 자동으로 수행할 SP를 추가해서 Service요청만으로 Message를 처리하도록 설정할 수 있습니다

**Alter Queue** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/alter-queue-transact-sql?view=sql-server-ver15][sb-alter-queue]

```sql
--Queue의 설정을 변경한다
alter queue dbo.PlayerBasic_ProcessingQueue
    with activation
    (
        status = on,
        procedure_name = dbo.mg_set_broker_processing_player_info,
        max_queue_readers = 10,
        execute as self
    );
go
```

[sb-message-type]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-message-type-transact-sql?view=sql-server-ver15
[sb-create-contract]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-contract-transact-sql?view=sql-server-ver15
[sb-create-queue]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-queue-transact-sql?view=sql-server-ver15
[sb-create-service]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/create-service-transact-sql?view=sql-server-ver15
[sb-begin-dialog]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/begin-dialog-conversation-transact-sql?view=sql-server-ver15
[sb-waitfor-receive]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/receive-transact-sql?view=sql-server-ver15
[sb-alter-queue]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/alter-queue-transact-sql?view=sql-server-ver15
