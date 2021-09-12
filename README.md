# 트위터 클론

# Twitter Clone


## 계획
 mySQL 과 mongoDB 를 typeorm 을 사용하여 트위터를 클론코딩을 하기를 계획했다.
 mySQL은 유저의 정보를 저장, mongoDB는 게시판 등 유저의 정보외에 유연하게 구성하기로 했다.
 클론코딩을 하면서 여러문제와 맞닥뜨리게 되었다.
 
 
 ## 문제
 - 문제 1 : typeorm은 두개의 서로 다른 데이터 베이스를 사용할수 없었다. 

typeORM문서에 [multiple-connections](https://typeorm.io/#/multiple-connections)을 보면 두개의 데이터 베이스가 연결이 가능하다고 적혀있다. 
서로 다른 데이터 두 개를 연결할 경우 연결 자체에는 문제가 없었지만 Entity를 불러올 때 문제가 발생한다.
두개의 연결 데이터중에 하나의 데이터만 사용하는 경우에는 문제가 없었지만 두개의 데이터 베이스를 쓰기 시작하면 문제가 생기기 시작한다.
```sh
import {getConnection} from "typeorm";

const db1Connection = getConnection("db1Connection");
// you can work with "db1" database now...

const db2Connection = getConnection("db2Connection");
// you can work with "db2" database now...
츌처(https://typeorm.io/#/multiple-connections)
```
위의 문서를 보면 특별한 연결할이름을 정해야하는데 두개의 데이터 베이스중에 무조건 하나의 데이터베이스에 "`Default`"를 넣어야 한다.
그리고 다른 하나의 데이터베이스에는 "`Default`" 를 사용 할 수 없어진다.
하지만 두개의 데이터 베이스를를 사용하면 두개의 데이터 베이스가 모두 "`Default`"를 요구하게 되면서 오류가 나타난다.

구글링을 통해 최대한 많은 정보를 찾으려고 해봤지만 `해결방법을 찾지 못했다`.

 - 문제 2 :  문제1 의 문제를 너무 늦게 발견했다.

클론코딩을 하면서 데이터베이스의 연결을 확인한 후 하나의 데이터베이스를 먼저 만들고 그 다음 다른 데이터베이스를 만드는 방법으로 진행했다.
두개의 데이터 베이스를 연결해도 두개의 데이터베이스를 동시에 사용하는것이 아니라면 문제가 나타나지 않는다.
문제를 발견한 시기가 계획했던 부분 중 mySQL부분의 많은 부분을 만들고 mongoDB또한 만든 뒤 합치는데 문제가 발생을 했다.
결국은 두개중 하나의 데이터 베이스를 버리게 되며 하나의 데이터베이스 가지고 만들어야 했다.

 - 문제 3 : 부족한 정보량

typeorm을 검색 하면 대부분 NestJS에 대한 정보가 많다. 더군다나 typeorm 과 mongoDB의 조합은 정보를 찾기 너무 힘들었다.
대부분 mongoose 또는 mongodb 자체의 정보가 있더나 express + mongodb의 조합이 과반수를 차지하고 있었다.
여러 정보들의 정보의 조각을 찾아 짜집기해서 완성은 했지만 내가 완성한 부분의 많은 부분이 이해가 되지 않았다.

 ## 결과

여러가지 우여곡절이 있었지만 결국은 완성은 했다.
중간에 만들었던 구조가 있어서 완전히 뒤업지는 못하고 mySQL 부분만 mongoDB로 바꿔 넣었지만 typerom에 mongodb으로 인해 여러가지 문제를 격었고 여러 문제를 해결하지 못했고 버그도 많이 있지만 만드는데는 성공을 햇다.
 

## 기술
 - Typescript
 - mongoDB
 - typeORM
 - pug
 - saaa
 - webpack

<img width="858" alt="twiiter" src="https://user-images.githubusercontent.com/32337856/133003505-4421c33e-70ad-4270-bc99-cf0c12abcc1b.png">
