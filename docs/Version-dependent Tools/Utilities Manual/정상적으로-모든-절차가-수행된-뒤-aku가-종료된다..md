   # 정상적으로 모든 절차가 수행된 뒤 aku가 종료된다. 
   AKU run successfully.
   ```

### 5) aku -p end 명령 수행 시

- `aku -p end` 명령은 Altibase 서버를 중지하기 전에 수행해야 한다.

- `aku -p end` 명령 수행이 완료된 후 파드를 종료해야 한다. 

### 6) aku -p end 명령이 완료되기 전에 파드가 종료되었거나 AKU_REPLICATION_RESET_AT_END 프로퍼티를 0으로 설정하고 파드를 종료했다면

이중화 정보가 초기화되지 않고 남아 있을 수 있다. 이 경우 해당 파드가 다시 시작할 때 이중화 객체 생성과 이중화 대상 테이블을 TRUNCATE 하는 작업이 생략되고 이전에 생성한 이중화가 자동으로 시작된다. AKU_REPLICATION_RESET_AT_END 프로퍼티를 1으로 설정하고 `aku -p end` 명령이 정상적으로 수행될 때의 출력 결과는 [예시 4](#예시-4)를 확인해 보자.

### 7) aku -p end 명령이 완료되기 전에 파드가 종료되었거나 AKU_REPLICATION_RESET_AT_END 프로퍼티를 0으로 설정하고 파드를 종료한 상태가 장기간 지속된다면<a name="cautions7"></a>

종료된 파드뿐 아니라 다른 파드에도 이중화 정보가 초기화되지 않고 남아 있을 수 있다. 이 경우 다른 파드는 종료된 파드로 이중화 하기 위해 이중화에 필요한 온라인 로그 파일을 삭제하지 않는다. 온라인 로그 파일이 쌓이면 디스크 풀 발생으로 Altibase 서버가 정상적으로 운영되지 못할 수 있다. 따라서 이런 상황을 방지하기 위해  `aku -p end` 명령이 완전히 완료되기 전에 파드가 종료되었거나, AKU_REPLICATION_RESET_AT_END 프로퍼티를 0으로 설정하고 파드를 종료한 상태가 장기간 지속되고 있다면 이중화를 중지하고 이중화 초기화 작업을 진행해야 한다. 

~~~sql
ALTER REPLICATION replication_name STOP;
ALTER REPLICATION replication_name RESET;
~~~

*pod_name*-0과 *pod_name*-1을 운영하던 중에 *pod_name*-1에서 `aku -p end` 명령이 정상적으로 수행되지 못하고 종료되었다고 가정해 보자. 이 때 *pod_name*-0에서 SYSTEM_.SYS_REPLICATIONS\_의 XSN을 조회하면 *pod_name*-0과 *pod_name*-1의 이중화 객체인 AKU_REP_01의 XSN 값이 -1이 아닌 다른 값으로 출력된다. 이는 이중화 정보가 초기화되지 않은 것을 의미한다.

~~~sql
iSQL> SELECT REPLICATION_NAME, XSN FROM SYSTEM_.SYS_REPLICATIONS_;
REPLICATION_NAME                XSN                  
--------------------------------------------------------
AKU_REP_03                      -1
AKU_REP_02                      -1
AKU_REP_01                      859070110
3 rows selected.
~~~

*pod_name*-0에서 AKU_REP_01을 중지하고 이중화 객체를 생성한 시점으로 초기화한다. 

~~~sql
iSQL> ALTER REPLICATION AKU_REP_01 STOP;
Alter sucess.

iSQL> ALTER REPLICATION AKU_REP_01 RESET;
Alter sucess.
~~~

다시 *pod_name*-0에서 SYSTEM_.SYS_REPLICATIONS\_의 XSN을 조회해 보자. 이중화 객체 AKU_REP_01의 XSN 값이 -1으로 변경되었다.

~~~sql
iSQL> SELECT REPLICATION_NAME, XSN FROM SYSTEM_.SYS_REPLICATIONS_;
REPLICATION_NAME                XSN                  
--------------------------------------------------------
AKU_REP_03                      -1
AKU_REP_02                      -1
AKU_REP_01                      -1
3 rows selected.
~~~

<br/>

## 제약사항

aku 유틸리티를 안정적으로 사용하기 위해 쿠버네티스 환경 설정 시 반드시 지켜야 할 조건이다. 

- 쿠버네티스의 워크로드 컨트롤러 중 **스테이트풀셋에서만 사용**해야 한다.
- **Altibase 서버와 aku는 같은 컨테이너에서 실행**해야 한다.
- **파드 관리 정책은 OrderedReady** 여야 한다. OrderedReady는 스테이트풀셋의 기본 정책이다.
- 스케일 업할 수 있는 레플리카는 **최대 6개**이다.
- 파드 종료 시 aku 수행을 완료할 수 있는 시간을 확보해야 한다. 따라서, 쿠버네티스에서 파드를 강제 종료하는 대기 시간인 terminationGracePeriodSeconds를 충분히 크게 설정해야 한다.

<br/>

## 사용 예

이 장에서는 다양한 상황에서 aku를 사용하는 예제를 설명한다.

예제에서 확인할 수 있는 aku 로그의 정보는 다음과 같다.

```
[AKU][현재 날짜 시간][스레드 번호] [메시지 타입][코드 정보][대상 pod 이름][이중화 이름] 메시지
```

### 예시 1

-i 파라미터를 사용하여 aku를 실행한 결과이다. 아래 결과는 [aku 설정 파일](#aku-설정-파일)의 aku.conf.sample로 구성한 aku.conf에서 수행한 예시이다. Server ID가 0인 것은 스테이트풀셋 컨트롤러에서 처음 생성한 파드를 의미한다.

~~~bash
$ aku -i
 #########################
 [ Server ]
  Server ID        : 0
  Host             : AKUHOST-0.altibase-svc
  User             : SYS
  Password         : manager
  Port             : 20300
  Replication Port : 20301
  Max Server Count : 4
 #########################
 [ Replications ]
 #### Serve[ID:0] Replication list ####
  Replication Name : AKU_REP_01
  Replication Name : AKU_REP_02
  Replication Name : AKU_REP_03
 #### Serve[ID:1] Replication list ####
  Replication Name : AKU_REP_01
  Replication Name : AKU_REP_12
  Replication Name : AKU_REP_13
 #### Serve[ID:2] Replication list ####
  Replication Name : AKU_REP_02
  Replication Name : AKU_REP_12
  Replication Name : AKU_REP_23
 #### Serve[ID:3] Replication list ####
  Replication Name : AKU_REP_03
  Replication Name : AKU_REP_13
  Replication Name : AKU_REP_23
 #########################
 [ Replication Items ]
  User Name        : SYS
  Table Name       : T1
 
  User Name        : SYS
  Table Name       : T2
 
  User Name        : SYS
  Table Name       : T3
 #########################
~~~

### 예시 2

마스터 파드(*pod_name-0*)에서 `aku -p start`를 수행한 예시이다.

~~~bash
$ aku -p start
AKU started with START option.
[AKU][2024/03/18 12:34:58.136944][140708807235840] [INFO][akuRunStart:828][-][-] Start as MASTER Pod.
AKU run successfully.
~~~

출력 결과를 살펴보자. 

~~~bash
# aku.conf를 읽어 이중화 객체를 생성한다. 
# START option은 aku -p start 를 사용함을 의미한다.
AKU started with START option.

# MASTER Pod는 첫 번째 파드를 의미한다. 
[AKU][2024/03/18 12:34:58.136944][140708807235840] [INFO][akuRunStart:828][-][-] Start as MASTER Pod.

# 정상적으로 모든 절차가 수행된 뒤 aku가 종료된다. 
AKU run successfully.
~~~

### 예시 3

네 번째 파드(*pod_name-3*)에서 `aku -p start` 명령을 수행한 예시이다. Master Pod는 스테이트풀셋에서 생성한 첫 번째 파드를 의미한다.

~~~bash
$ aku -p start
AKU started with START option.
[AKU][2024/03/18 14:01:59.604647][140678415444224] [INFO][akuRunStart:903][-][-] Start as SLAVE Pod.
[AKU][2024/03/18 14:02:01.005068][140678415444224] [INFO][akuRunStart:959][-][-] Truncate tables for replications.
[AKU][2024/03/18 14:02:01.025100][140678415444224] [INFO][akuRunStart:964][-][-] Table truncation has ended.
[AKU][2024/03/18 14:02:01.025877][140678415444224] [INFO][akuRunStart:975][-][-] Sync tables from MASTER Server.
[AKU][2024/03/18 14:02:05.045135][140678415444224] [INFO][akuRunStart:980][-][-] Replication sync has ended.
AKU run successfully.
~~~

출력 결과를 살펴보자. 

~~~bash
# aku.conf를 읽어 이중화 객체를 생성한다. 
# START option은 aku -p start 를 사용함을 의미한다.
 AKU started with START option.

# SLAVE Pod는 첫 번째 파드가 아닌 다른 파드를 의미한다. 
[AKU][2024/03/18 14:01:59.604647][140678415444224] [INFO][akuRunStart:903][-][-] Start as SLAVE Pod.

# SYNC 시 레코드 충돌 방지를 위해 대상 테이블의 레코드를 모두 삭제한다.
[AKU][2024/03/18 14:02:01.005068][140678415444224] [INFO][akuRunStart:959][-][-] Truncate tables for replications.
[AKU][2024/03/18 14:02:01.025100][140678415444224] [INFO][akuRunStart:964][-][-] Table truncation has ended.

# MASTER Server는 첫 번째 파드(pod_name-0)의 Altibase 서버를 말하며 해당 서버의 데이터를 로컬 파드로 동기화한다.
[AKU][2024/03/18 14:02:01.025877][140678415444224] [INFO][akuRunStart:975][-][-] Sync tables from MASTER Server.
[AKU][2024/03/18 14:02:05.045135][140678415444224] [INFO][akuRunStart:980][-][-] Replication sync has ended.

# 정상적으로 모든 절차가 수행된 뒤 aku가 종료된다. 
AKU run successfully. 
~~~

### 예시 4

네 번째 파드에서 AKU_REPLICATION_RESET_AT_END 프로퍼티를 1으로 설정하고 `aku -p end` 명령을 수행할 때의 출력 결과이다. 이중화 FLUSH 및 RESET 명령이 수행된 것을 볼 수 있다

~~~bash
$ aku -p end
AKU started with END option.
[AKU][2024/03/18 14:02:49.246961][139626938108160] [INFO][akuRunEnd:1090][-][-] Start as SLAVE Pod.
[AKU][2024/03/18 14:02:49.247094][139626938108160] [INFO][akuRunEnd:1095][-][-] Flush replications.
[AKU][2024/03/18 14:02:49.247731][139626938108160] [INFO][akuRunEnd:1100][-][-] Replication flush has ended.
[AKU][2024/03/18 14:02:52.001848][139626938108160] [INFO][akuRunEnd:1114][-][-] Reset replications.
[AKU][2024/03/18 14:02:52.014300][139626938108160] [INFO][akuRunEnd:1119][-][-] Replication reset has ended.
AKU run successfully.
~~~

출력 결과를 살펴보자.

```bash
# aku.conf를 읽어 이중화를 중지하고 초기화한다. 
# END option은 aku -p end 를 사용함을 의미한다.
AKU started with END option.

# SLAVE Pod는 첫 번째 파드가 아닌 다른 파드를 의미한다. 
[AKU][2024/03/18 14:02:49.246961][139626938108160] [INFO][akuRunEnd:1090][-][-] Start as SLAVE Pod.

# 전달되지 않은 변경사항을 다른 파드로 FLUSH 한다.
[AKU][2024/03/18 14:02:49.247094][139626938108160] [INFO][akuRunEnd:1095][-][-] Flush replications.
[AKU][2024/03/18 14:02:49.247731][139626938108160] [INFO][akuRunEnd:1100][-][-] Replication flush has ended.

# 로컬 파드의 AKU 에서 생성한 이중화 객체를 모두 초기화한다.
[AKU][2024/03/18 14:02:52.001848][139626938108160] [INFO][akuRunEnd:1114][-][-] Reset replications.
[AKU][2024/03/18 14:02:52.014300][139626938108160] [INFO][akuRunEnd:1119][-][-] Replication reset has ended.

# 정상적으로 모든 절차가 수행된 뒤 aku가 종료된다. 
AKU run successfully. 
```



