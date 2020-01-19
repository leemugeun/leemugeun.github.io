---
layout: post
title : DB
icon: db
postname : Database
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

## Transaction 격리성 수준

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

트랜잭션의 격리성은 Lock을 강하게 오래 유지할수록 강화되고, Lock을 최소화 핤수록 약화된다. 낮은단계의 격리성 수준에서는 다음과 같은 현상이 발생한다

**Dirty Read**  
다른 트랜잭션에 의해 수정됐지만 아직 커밋되지 않은 데이터를 읽는 것을 말한다. 변경 후 아직 커밋되지 않은 값을 읽었는데 변경을 가한 트랜잭션이 최종적으로 롤백된다면 그 값을 읽은 트랜잭션은 비일관 상태에 놓이게 된다

아래의 경우에는 weight의 값이 50일 때 **TX2**수행중에 `rollback`되었음에도 불구하고 **TX1**를 실행했을 때의 결과값은 weight를 **80**으로 조회하게된다

| TX1                       | TX2 |
|---------------------------|---------------------------|
|                           | update dbo.player         |
|                           | set weight = 80           |
|                           | where player_id = 2000001 |
| select weight             |                           |
| from dbo.player           |                           |
| where player_id = 2000001 |                           |
| --weight : 80             |                           |
|                           | rollback                  |

weight: 50

**Non-Repeatabla Read**  
fff