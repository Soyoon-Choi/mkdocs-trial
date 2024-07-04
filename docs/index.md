# Altibase 7.3 매뉴얼

Altibase란?
Altibase는 고성능, 고가용성, 확장성을 갖춘 하이브리드 DBMS입니다. In-memory와 Disk-based 아키텍처를 결합하여 빠른 데이터 처리 속도와 안정성을 동시에 제공합니다. 수많은 기업들이 Altibase를 통해 대용량 데이터를 효율적으로 관리하고 있습니다.

<div class="grid cards" markdown>

-   __Administrator__

    ---

    DBMS 관리자 및 일반 사용자라면

    [:octicons-arrow-right-24: Admin](../docs/Admin/Getting%20Started%20Guide/0.서문.md)

-   __Developer__

    ---

    Altibase의 개발자 문서를 찾는다면

    [:octicons-arrow-right-24: Developer](../docs/Developer/index.md)

-   __Tools__

    ---

    Altibase 도구 문서를 찾는다면

    [:octicons-arrow-right-24: Tools](../docs/Tools/index.md)

</div>

!!! example "매뉴얼 퀵 가이드"
    === "DBMS 관리자라면"
        - [Getting Started Guide](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Getting%20Started%20Guide/0.%EC%84%9C%EB%AC%B8/)
        - [Installation Guide](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Installation%20Guide/0.%EC%84%9C%EB%AC%B8/)
        - [Administrator's Manual](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Administrator%27s%20Manual/0.%EC%84%9C%EB%AC%B8/)
       
    
    === "개발자라면"
        - [SQL Reference](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/SQL%20Reference.md)

## Topic Quick Reference Table

|Admin|Developer|Version-DependentTools|Tools|Message|
|----|-----|----|----|----|
|[Getting Started Guide](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Getting%20Started%20Guide/0.%EC%84%9C%EB%AC%B8/)|[SQL Reference](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/SQL%20Reference.md)|[Adapter for JDBC User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Adapter%20for%20JDBC%20User's%20Manual.md)|[Altibase 3rd Party Connector Guide](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/Altibase%203rd%20Party%20Connector%20Guide.md)|[Error Message Reference](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Error%20Message%20Reference.md)|
||[Spatial SQL Reference](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Spatial%20SQL%20Reference.md)|[Adapter for Oracle User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Adapter%20for%20Oracle%20User's%20Manual.md)|[Altibase Heartbeat User's Guide](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/Altibase%20Heartbeat%20User's%20Guide.md)||
||[Stored Procedures Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Stored%20Procedures%20Manual.md)|[Altibase SSL/TLS User's Guide](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Altibase%20SSL%20TLS%20User's%20Guide.md)|[altiShapeLoader User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/altiShapeLoader%20User's%20Manual.md)|||
|[Replication Manual](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Replication%20Manual/0.%20%EC%84%9C%EB%AC%B8/)|[C/C++ External Procedures Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/External%20Procedures%20Manual.md)|[Hadoop Connector User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Hadoop%20Connector%20User's%20Manual.md)|[Migration Center User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/Migration%20Center%20User's%20Manual.md)|||
|[General_Reference-1.Data Types & Altibase Properties](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/General_Reference-1.Data%20Types%20%26%20Altibase%20Properties/0.%20%EC%84%9C%EB%AC%B8/)|[Precompiler User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Precompiler%20User's%20Manual.md)|[iLoader User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/iLoader%20User's%20Manual.md)|[Replication Manager User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/Replication%20Manager%20User's%20Manual.md)||
|[General_Reference-2.The Data Dictionary](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/General_Reference-2.The%20Data%20Dictionary/0.%EC%84%9C%EB%AC%B8/)|[CLI User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/CLI%20User's%20Manual.md)|[iSQL User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/iSQL%20User's%20Manual.md)|[dataCompJ User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Tools/Altibase_release/kor/dataCompJ%20User's%20Manual.md)|||
|[Performance Tuning Guide](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/Performance%20Tuning%20Guide/0.%EC%84%9C%EB%AC%B8/)|[ODBC User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/ODBC%20User's%20Manual.md)|[Utilities Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Utilities%20Manual.md)|||
|[SNMP Agent Guide](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/SNMP%20Agent%20Guide/0.%EC%84%9C%EB%AC%B8/)|[JDBC User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/JDBC%20User's%20Manual.md)||||
|[DB Link User's Manual](https://soyoon-choi-mkdocs-trial.readthedocs-hosted.com/ko/7.3/Admin/DB%20Link%20User%27s%20Manual/0.%20%EC%84%9C%EB%AC%B8/)|[API User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/API%20User's%20Manual.md)|||||
||[Altibase C Interface Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Altibase%20C%20Interface%20Manual.md)||||
||[Log Analyzer User's Manual](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Log%20Analyzer%20User's%20Manual.md)||||
||[Monitoring API Developer's Guide](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Monitoring%20API%20Developer's%20Guide.md)|||

커뮤니티 및 지원:
추가적인 도움이 필요하신가요? Altibase 사용자 커뮤니티와 공식 지원 채널을 이용해보세요. 다양한 문제 해결과 팁을 공유할 수 있습니다.