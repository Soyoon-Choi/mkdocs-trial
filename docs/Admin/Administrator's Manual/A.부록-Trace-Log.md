# A.부록: Trace Log

### Trace Log 

아래 프로퍼티는 Altibase 서버에서 수행되는 SQL문의 정보, 에러 메시지 종류 및 SQL 문의 수행 소요 시간 등을 altibase_boot.log 파일에 기록하게 할 수 있는 프로퍼티이다.

이 프로퍼티의 기본 값은 0이며, 위의 정보들을 trace log로 기록하려면 1을 설정한다.

프로퍼티 파일에 명시된 값은 ALTER SYSTEM 문을 이용하여 변경할 수 있다.
프로퍼티에 대한 자세한 설명은 *[General Reference](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/General%20Reference-1.Data%20Types%20%26%20Altibase%20Properties.md#trclog_detail_predicate)*를 참고하기 바란다.

| TRCLOG                  | 설명                                                         |
| ----------------------- | ------------------------------------------------------------ |
| TRCLOG_DETAIL_PREDICATE | EXPLAIN PLAN 을 ON(또는 ONLY)로 설정시, where 절의 predicate 분류 상태도 함께 출력할지를 지정함 |

