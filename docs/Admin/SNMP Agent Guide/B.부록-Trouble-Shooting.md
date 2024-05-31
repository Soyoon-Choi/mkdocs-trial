# B.부록: Trouble Shooting

### FAQ

##### 질문

altisnmpd를 실행했을 때 "Error: Failed to connect to the agentx master agent:
Unknown host (Connection refused)" 에러가 발생합니다.

##### 답변

snmpd 데몬이 실행중인지 확인하기 바랍니다.

만약 snmpd가 실행중이라면 altisnmpd의 -x 옵션으로 IP와 PORT가 맞는지 확인하기
바랍니다.

##### 질문

snmpget, snmpwalk 명령을 실행했을 때 "No Such Object available on this agent at
this OID" 에러가 발생합니다.

##### 답변

altisnmpd와 snmpd가 통신을 제대로 못하고 있을 때 발생할 수 있습니다. altisnmpd가
실행중인지 확인하기 바랍니다.

만약 snmpd를 재시작했다면 altisnmpd도 반드시 재시작해야 합니다

##### 질문

snmpset 명령을 실행했을 때 "Error in packet. Reason: notWritable (that object
does not support modification)..." 에러가 발생합니다.

##### 답변

read-only 객체의 값을 설정한 경우 발생할 수 있습니다. 만약 read-write 객체라면
통신 문제이니 위의 내용을 확인하기 바랍니다.

##### 질문

snmpget, snmpwalk 명령을 실행했을 때 "No Such Instance currently exists at this
OID" 에러가 발생합니다.

##### 답변

OID나 객체 이름이 제대로 지정되었는지 확인합니다. snmpwalk 명령을 사용하여
altibase에서 제공하는 MIB 정보를 확인할 수 있습니다.

```
ex> snmpwalk -v 2c -c private IP:PORT altibase
```

또한 Altibase가 실행중인지 확인하기 바랍니다.

##### 질문

snmpget, snmpwalk 명령을 실행했을 때 "Unknown Object Identifier (Sub-id not
found: (top) -\> xxx)" 에러가 발생합니다.

##### 답변

OID나 Object 이름이 제대로 지정되었는지 확인합니다.

ALTIBASE-MIB.txt 파일이 로딩이 안된 경우, \$MIBDIRS에 ALTIBASE-MIB.txt 파일이
있는지 확인한 후 \$MIBS가 ALL로 설정되었는지 확인하기 바랍니다.

##### 질문

snmpwalk 명령을 실행했을 때 ATIBASE MIB 전체가 출력이 되지 않습니다.

```
ex> snmpwalk -v 2c -c private IP:PORT altibase
ALTIBASE-MIB::altiPropertyIndex.1 = INTEGER: 1
ALTIBASE-MIB::altiStatusIndex.1 = INTEGER: 1  
```

##### 답변

ATLIBASE MIB 전체가 출력되지 않을 경우, Altibase가 실행중인지 확인하기 바랍니다.
