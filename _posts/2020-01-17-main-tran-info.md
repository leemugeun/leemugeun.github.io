---
layout: post
title : Transaction
icon: db
permalink: /db/tran
---

`트랜잭션(이하 TX)`은 데이터 처리를 위한 하나의 논리적 단위이며 하나의 TX 안에서 두개 이상의 여러 연산일 수 있다.  
실제 사용시에는 일반쿼리를 사용하여 만들 수 있지만 주로 `Stored Procedure(이하 SP)`를 실행할때 사용되므로 실행시에 다음과 같은 형태로 나타난다.  
아래의 TX는 2줄에 불과하지만 2줄이든 100줄이든 3000줄이든 트랜잭션으로 묶여있다면 그것이 하나의 작업단위이다

```sql
begin
    select *
    from dbo.player
end
```

## Transaction의 특징

TX의 특징은 다음과 같으며 SP의 사용방법만 안다면 아래의 내용도 한번쯤 알 필요가 있다

**원자성(Atomicity)**  
TX은 더 이상 분해가 불가능한 업무의 최소 단위이므로 전부 처리되거나 아예 하나도 처리되지 않아야 한다

**일관성(Consistency)**  
일관된 상태의 데이터베이스에서 하나의 트랜잭션을 성공적으로 완료하고 나면 그 데이터베이스는 여전히 일관된 상태여야 한다. 즉, TX 실행의 결과로 데이터베이스 상태가 모순되지 않아야 한다

**격리성(Isolation)**  
실행 중인 TX의 중간결과를 다른트랜잭션이 접근 할 수 없다

**영속성(Durability)**  
TX가 일단 그 실행을 성공적으로 완료하면 그 결과는 데이터베이스에 영속적으로 저장된다.

## Transaction의 격리성

아래의 TX를 실행시 다른 TX가 Update쿼리에 의해 WEIGHT값을 변경해서, 아래 쿼리의 Update실행문이 실행되지 않을 수 있는데 이유는 TX의 격리성 때문이다.

```sql
begin
 update dbo.player
 set weight = weight + 35
 where player_id = 2000001
 and weight > 40

 select player_id, player_name, team_id, weight
 from dbo.player
 where player_id = 2000001
end
```

### 낮은단계의 격리성 수준

트랜잭션의 격리성은 Lock을 강하게 오래 유지할수록 강화되고, Lock을 최소화 할수록 약화된다. 낮은단계의 격리성 수준에서는 다음과 같은 현상이 발생한다

**1)Dirty Read**  
다른 트랜잭션에 의해 수정됐지만 아직 커밋되지 않은 데이터를 읽는 것을 말한다. 변경 후 아직 커밋되지 않은 값을 읽었는데 변경을 가한 트랜잭션이 최종적으로 롤백된다면 그 값을 읽은 트랜잭션은 비일관 상태에 놓이게 된다

아래의 경우에는 weight의 값이 50일 때 **TX2**수행중에 `rollback`되었음에도 불구하고 **TX1**를 실행했을 때의 결과값은 weight를 **80**으로 조회하게된다

| TX1                       | TX2                       |
|---------------------------|---------------------------|
|                           | 1.                        |
|                           | update dbo.player         |
|                           | set weight = 80           |
|                           | where player_id = 2000001 |
|                           |                           |
| 2.                        |                           |
| select weight             |                           |
| from dbo.player           |                           |
| where player_id = 2000001 |                           |
| --weight : 80             |                           |
|                           |                           |
|                           | 3.                        |
|                           | `rollback`                |

weight: 50

**2)Non-Repeatabla Read**  
한 트랜잭션 내에서 같은 쿼리를 두 번 수행했는데, 그 사이에 다른 트랜잭션이 값을 수정 또는 삭제하는 바람에 두 쿼리 결과가 다르게 나타나는 현상을 말한다

아래의 경우는 **TX1**이 실행 중 **TX2**에 의해 weight값이 50인 player_id대상을 업데이트 할수 있다고 확인했음에도 불구하고 **'Fail'** 문구를 보게된다

| TX1                           | TX2                       |
|-------------------------------|---------------------------|
| --weight : 50                 |                           |
|                               |                           |
| 1.                            |                           |
| select weight                 |                           |
| from dbo.player               |                           |
| where player_id = 2000001     |                           |
|                               |                           |
|                               | 2.                        |
|                               | update dbo.player         |
|                               | set weight = 10           |
|                               | where player_id = 2000001 |
|                               |                           |
|                               | 3.                        |
|                               | commit;                   |
|                               |                           |
|                               | --weight:10               |
|                               |                           |
| 4.                            |                           |
| update dbo.player             |                           |
| set weight = weight + 30      |                           |
| where player_id = 2000001     |                           |
| and weight = 50               |                           |
|                               |                           |
| 5.                            |                           |
| if exists (                   |                           |
|     select weight             |                           |
|     from dbo.player           |                           |
|     where player_id = 2000001 |                           |
|     and weight = 80           |                           |
|   )                           |                           |
|   begin                       |                           |
|       print 'Success'         |                           |
|   end                         |                           |
|   else                        |                           |
|   begin                       |                           |
|       print 'Fail'            |                           |
|   end                         |                           |
|                               |                           |
| 6.                            |                           |
| commit;                       |                           |
|                               |                           |

**TX1**는 weight가 50인값에 대해 80으로 Update하려 했지만, 실행 중 **TX2**로 인해 weight가 10으로 되어서 **'Success'**결과를 받지 못하게된다  

**3)Phantom Read**  
한 트랜잭션 내에서 같은 데이터를 집계하는 쿼리를 두번 실행했는데, 첫번째 쿼리엡서 집계되지 않은 유령(Phantom) 레코드가 두번째 쿼리에서 나타나는 현상을 말한다.

| TX1                       | TX2                                           |
|---------------------------|-----------------------------------------------|
|                           |                                               |
| 1.                        |                                               |
| select count(*)           |                                               |
| from dbo.PLAYER           |                                               |
| group by TEAM_ID          |                                               |
|                           |                                               |
|                           | 2.                                            |
|                           | insert into dbo.PLAYER                        |
|                           | (PLAYER_ID, PLAYER_NAME, TEAM_ID, POSITION)   |
|                           | values (2000099, '홍길동', 'K6', 'FW')         |
|                           |                                               |
| 3.                        |                                               |
| select count(*)           |                                               |
| from dbo.PLAYER           |                                               |
| group by POSITION         |                                               |
|                           |                                               |

**TX1**이 집계하는 도중 **TX2**가 집계중인 테이블에 Insert쿼리를 날렸다. **TX1**은 같은 데이터를 집계하려고 했지만 중간에 **TX2**로 인해 **TX1**은 서로 Count값이 다른 데이터를 집계해서 의도하지 않은 결과가 나오게 된다

## Transaction격리성 수준  

각 격리성마다 장단점이 있으며, 데이터의 쓰임새나 성능고려 등 여러가지 상황에 맞게 트랜잭션 격리성 수준 처리를 하면된다.

**Read Uncommmitted**  
가장 낮은단계의 격리성 수준이며 트랜잭션에서 처리중인, 아직 Commit이나 Rollback이 되지않은 데이터를 다른 트랜잭션이 읽는 것을 허용한다.

**Read Commmitted**  
트랜잭션이 커밋되어 확정된 데이터만 다른 트랜잭션이 읽도록 허용함으로써 *Dirty Read*가 일어날 경우를 방지해준다.

커밋된 데이터만 읽더라도 *Non-Repeatable Read*와 *Phantom Read* 현상을 막지는 못한다.  

커밋된 데이터를 읽기때문에 트랜잭션 수행중 중간에 커밋된 데이터가 다음 쿼리에 의해 어떻게 바뀔지 모르지만 커밋되었기 때문에 읽어오기 때문이다.

**Repeatable Read**  
트랜잭션 내에서 쿼리를 두번이상 수행할 때, 첫번째 쿼리에 있던 레코드가 사라지거나 값이 바뀌는 현상을 방지해 준다.

쿼리에 있던 레코드가 사라지는 것을 방지할 뿐 트랜잭션 실행중 새 Insert가 일어나는 것을 방지해주지는 못한다.

**Serializable Read**  
가장 엄격한 수준의 격리성 수준이며, 트랜잭션 내에서 쿼리를 두 번 이상 수행할 때 첫번째 쿼리에 있던 레코드가 사라지거나 값이 바뀌지 않음은 물론 새로운 레코드가 나타나지 않는다.

즉 트랜잭션 자체에 잠금이 일어나서 다른트랜잭션이 이 레코드에 접근하지 못하며 동시처리능력이 떨어진다.

## Transaction 격리성 수준과 비일관성 현상  

| Level             |   |Dirty Read         |   | Non-Repeatable Read |   | Phantom Read |
|-------------------|---|:-----------------:|---|:-------------------:|---|:------------:|
|                   |   |                   |   |                      |   |           |
| Read Uncommmitted |   |가능               |   | 가능                 |   | 가능        |
|                   |   |                   |   |                      |   |           |
| Read Commmitted   |   |불가능              |   | 가능                 |   | 가능        |
|                   |   |                   |   |                      |   |           |
| Repeatable Read   |   |불가능             |   | 불가능               |   | 가능        |
|                   |   |                   |   |                      |   |           |
| Serializable Read |   |불가능             |   | 불가능               |   | 불가능      |
|                   |   |                   |   |                      |   |           |

## Transaction 격리성 사용법  

격리성 수준은 **level** 뒤에 격리성 수준을 정의해주면 된다

더 자세한 내용은 `MSDN`에 잘 나와있다

**Url** : [https://docs.microsoft.com/ko-kr/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver15][Tran-Isolation]

```sql
1.
set transaction isolation level read uncommitted
begin
    select *
    from dbo.PLAYER
    group by TEAM_ID
end

2.
set transaction isolation level read committed
begin
    select *
    from dbo.PLAYER
    group by TEAM_ID
end

3.
set transaction isolation level repeatable read
begin
    select *
    from dbo.PLAYER
    group by TEAM_ID
end


4.
set transaction isolation level read serializable
begin
    select *
    from dbo.PLAYER
    group by TEAM_ID
end
```

[Tran-Isolation]: https://docs.microsoft.com/ko-kr/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver15
