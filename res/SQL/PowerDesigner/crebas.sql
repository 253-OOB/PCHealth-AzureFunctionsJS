/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2017                    */
/* Created on:     3/25/2021 6:26:59 PM                         */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ACCOUNTS') and o.name = 'FK_ACCOUNTS_REFERENCE_ORGANISA')
alter table ACCOUNTS
   drop constraint FK_ACCOUNTS_REFERENCE_ORGANISA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CORES') and o.name = 'FK_CORES_REFERENCE_CPU_READ')
alter table CORES
   drop constraint FK_CORES_REFERENCE_CPU_READ
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CPU_READING') and o.name = 'FK_CPU_READ_REFERENCE_LEAF')
alter table CPU_READING
   drop constraint FK_CPU_READ_REFERENCE_LEAF
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('DISKS') and o.name = 'FK_DISKS_REFERENCE_DISK_REA')
alter table DISKS
   drop constraint FK_DISKS_REFERENCE_DISK_REA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('DISK_READING') and o.name = 'FK_DISK_REA_REFERENCE_LEAF')
alter table DISK_READING
   drop constraint FK_DISK_REA_REFERENCE_LEAF
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('LEAF') and o.name = 'FK_LEAF_REFERENCE_ORGANISA')
alter table LEAF
   drop constraint FK_LEAF_REFERENCE_ORGANISA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PROCESSES') and o.name = 'FK_PROCESSE_REFERENCE_PROCESS_')
alter table PROCESSES
   drop constraint FK_PROCESSE_REFERENCE_PROCESS_
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PROCESS_READING') and o.name = 'FK_PROCESS__REFERENCE_LEAF')
alter table PROCESS_READING
   drop constraint FK_PROCESS__REFERENCE_LEAF
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('RAM_READING') and o.name = 'FK_RAM_READ_REFERENCE_LEAF')
alter table RAM_READING
   drop constraint FK_RAM_READ_REFERENCE_LEAF
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('THREADS') and o.name = 'FK_THREADS_REFERENCE_PROCESSE')
alter table THREADS
   drop constraint FK_THREADS_REFERENCE_PROCESSE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('VIDEOCONTROLLER') and o.name = 'FK_VIDEOCON_REFERENCE_LEAF')
alter table VIDEOCONTROLLER
   drop constraint FK_VIDEOCON_REFERENCE_LEAF
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ACCOUNTS')
            and   type = 'U')
   drop table ACCOUNTS
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CORES')
            and   type = 'U')
   drop table CORES
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CPU_READING')
            and   type = 'U')
   drop table CPU_READING
go

if exists (select 1
            from  sysobjects
           where  id = object_id('DISKS')
            and   type = 'U')
   drop table DISKS
go

if exists (select 1
            from  sysobjects
           where  id = object_id('DISK_READING')
            and   type = 'U')
   drop table DISK_READING
go

if exists (select 1
            from  sysobjects
           where  id = object_id('LEAF')
            and   type = 'U')
   drop table LEAF
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ORGANISATION')
            and   type = 'U')
   drop table ORGANISATION
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PROCESSES')
            and   type = 'U')
   drop table PROCESSES
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PROCESS_READING')
            and   type = 'U')
   drop table PROCESS_READING
go

if exists (select 1
            from  sysobjects
           where  id = object_id('RAM_READING')
            and   type = 'U')
   drop table RAM_READING
go

if exists (select 1
            from  sysobjects
           where  id = object_id('THREADS')
            and   type = 'U')
   drop table THREADS
go

if exists (select 1
            from  sysobjects
           where  id = object_id('VIDEOCONTROLLER')
            and   type = 'U')
   drop table VIDEOCONTROLLER
go

/*==============================================================*/
/* Table: ACCOUNTS                                              */
/*==============================================================*/
create table ACCOUNTS (
   ID                   int                  identity,
   EMAIL                varchar(50)          not null,
   ORGANISATIONID       int                  not null,
   USERNAME             varchar(50)          not null,
   PASSWORD             varchar(max)         not null,
   REFRESHTOKEN         varchar(max)         null,
   constraint PK_ACCOUNTS primary key (ID),
   constraint AK_COMPANY_USERNAME_ACCOUNTS unique (ORGANISATIONID, USERNAME),
   constraint AK_USERNAME_ACCOUNTS unique (EMAIL)
)
go

/*==============================================================*/
/* Table: CORES                                                 */
/*==============================================================*/
create table CORES (
   CORE_READING_ID      int                  identity,
   CPU_READING_ID       int                  null,
   NAME                 varchar(max)         not null,
   PERCENTPROCESSORTIME bigint               not null,
   constraint PK_CORES primary key (CORE_READING_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('CORES') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'CORES' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_PerfFormattedData_PerfOS_Processor', 
   'schema', @CurrentUser, 'table', 'CORES'
go

/*==============================================================*/
/* Table: CPU_READING                                           */
/*==============================================================*/
create table CPU_READING (
   CPU_READING_ID       int                  not null,
   LEAFID               int                  null,
   TIMESTAMP            int                  not null,
   NAME                 varchar(max)         not null,
   NUMBEROFCORES        int                  not null,
   NUMBEROFLOGICALPROCESSORS int                  not null,
   THREADCOUNT          int                  not null,
   VIRTUALISATIONFIRMWAREENABLED bit                  not null,
   constraint PK_CPU_READING primary key (CPU_READING_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('CPU_READING') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'CPU_READING' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_Processor', 
   'schema', @CurrentUser, 'table', 'CPU_READING'
go

/*==============================================================*/
/* Table: DISKS                                                 */
/*==============================================================*/
create table DISKS (
   LOGICALDISK_READ_ID  int                  identity,
   DISK_READING_ID      int                  null,
   NAME                 varchar(max)         not null,
   FREESPACE            bigint               not null,
   SIZE                 varchar(max)         not null,
   STATUS               varchar(max)         not null,
   FILESYSTEM           varchar(max)         not null,
   DISKBYTESPERSEC      bigint               not null,
   DISKREADBYTESPERSEC  bigint               not null,
   DISKWRITEBYTESPERSEC bigint               not null,
   PERCENTFREESPACE     int                  not null,
   TIMESTAMP            int                  not null,
   constraint PK_DISKS primary key (LOGICALDISK_READ_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('DISKS') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'DISKS' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_PerfFormattedData_PerfDisk_LogicalDisk
   Win32_LogicalDisk', 
   'schema', @CurrentUser, 'table', 'DISKS'
go

/*==============================================================*/
/* Table: DISK_READING                                          */
/*==============================================================*/
create table DISK_READING (
   DISK_READING_ID      int                  identity,
   LEAFID               int                  null,
   TIMESTAMP            int                  not null,
   constraint PK_DISK_READING primary key (DISK_READING_ID)
)
go

/*==============================================================*/
/* Table: LEAF                                                  */
/*==============================================================*/
create table LEAF (
   LEAFID               int                  identity,
   LEAFTOKEN            varchar(max)         not null,
   ASSIGNEDNAME         varchar(50)          not null,
   ORGANISATIONID       int                  not null,
   constraint PK_LEAF primary key (LEAFID),
   constraint AK_LEAFTOKEN_LEAF unique (LEAFTOKEN)
)
go

/*==============================================================*/
/* Table: ORGANISATION                                          */
/*==============================================================*/
create table ORGANISATION (
   ORGANISATIONID       int                  identity,
   NAME                 varchar(50)          not null,
   PASSWORD             varchar(max)         not null,
   EMAIL                varchar(50)          not null,
   constraint PK_ORGANISATION primary key (ORGANISATIONID),
   constraint AK_EMAIL_ORGANISA unique (EMAIL)
)
go

/*==============================================================*/
/* Table: PROCESSES                                             */
/*==============================================================*/
create table PROCESSES (
   P_ID                 int                  identity,
   PROCESS_READING_ID   int                  null,
   NAME                 varchar(max)         not null,
   IDPROCESS            int                  not null,
   IODATABYTESPERSEC    bigint               not null,
   IOREADBYTESPERSEC    bigint               not null,
   IOWRITEBYTESPERSEC   bigint               not null,
   PAGEFAULTSPERSEC     int                  not null,
   PERCENTPROCESSORTIME bigint               not null,
   THREADCOUNT          int                  not null,
   WORKINGSET           bigint               not null,
   constraint PK_PROCESSES primary key (P_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('PROCESSES') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'PROCESSES' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_PerfFormattedData_PerfProc_Process', 
   'schema', @CurrentUser, 'table', 'PROCESSES'
go

/*==============================================================*/
/* Table: PROCESS_READING                                       */
/*==============================================================*/
create table PROCESS_READING (
   PROCESS_READING_ID   int                  identity,
   LEAFID               int                  null,
   TIME_STAMP           int                  not null,
   constraint PK_PROCESS_READING primary key (PROCESS_READING_ID)
)
go

/*==============================================================*/
/* Table: RAM_READING                                           */
/*==============================================================*/
create table RAM_READING (
   RAMID                int                  identity,
   LEAFID               int                  null,
   TOTALMEMORY          bigint               not null,
   AVAILABLEMEMORY      bigint               not null,
   PAGEFAULTSPERSEC     bigint               not null,
   TIMESTAMP            int                  not null,
   constraint PK_RAM_READING primary key (RAMID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('RAM_READING') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'RAM_READING' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_PhysicalMemory
   Win32_PerfFormattedData_PerfOS_Memory', 
   'schema', @CurrentUser, 'table', 'RAM_READING'
go

/*==============================================================*/
/* Table: THREADS                                               */
/*==============================================================*/
create table THREADS (
   T_READING_ID         numeric              identity,
   P_ID                 int                  null,
   NAME                 varchar(max)         not null,
   IDTHREAD             int                  not null,
   PERCENTPROCESSORTIME bigint               not null,
   THREADSTATE          varchar(max)         not null,
   constraint PK_THREADS primary key (T_READING_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('THREADS') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'THREADS' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_PerfFormattedData_PerfProc_Thread', 
   'schema', @CurrentUser, 'table', 'THREADS'
go

/*==============================================================*/
/* Table: VIDEOCONTROLLER                                       */
/*==============================================================*/
create table VIDEOCONTROLLER (
   VIDEOCONTROLLER_READING_ID numeric              identity,
   LEAFID               numeric              null,
   NAME                 varchar(max)         not null,
   TIMESTAMP            char(10)             not null,
   constraint PK_VIDEOCONTROLLER primary key (VIDEOCONTROLLER_READING_ID)
)
go

if exists (select 1 from  sys.extended_properties
           where major_id = object_id('VIDEOCONTROLLER') and minor_id = 0)
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'schema', @CurrentUser, 'table', 'VIDEOCONTROLLER' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   'Win32_VideoController', 
   'schema', @CurrentUser, 'table', 'VIDEOCONTROLLER'
go

alter table ACCOUNTS
   add constraint FK_ACCOUNTS_REFERENCE_ORGANISA foreign key (ORGANISATIONID)
      references ORGANISATION (ORGANISATIONID)
go

alter table CORES
   add constraint FK_CORES_REFERENCE_CPU_READ foreign key (CPU_READING_ID)
      references CPU_READING (CPU_READING_ID)
go

alter table CPU_READING
   add constraint FK_CPU_READ_REFERENCE_LEAF foreign key (LEAFID)
      references LEAF (LEAFID)
go

alter table DISKS
   add constraint FK_DISKS_REFERENCE_DISK_REA foreign key (DISK_READING_ID)
      references DISK_READING (DISK_READING_ID)
go

alter table DISK_READING
   add constraint FK_DISK_REA_REFERENCE_LEAF foreign key (LEAFID)
      references LEAF (LEAFID)
go

alter table LEAF
   add constraint FK_LEAF_REFERENCE_ORGANISA foreign key (ORGANISATIONID)
      references ORGANISATION (ORGANISATIONID)
go

alter table PROCESSES
   add constraint FK_PROCESSE_REFERENCE_PROCESS_ foreign key (PROCESS_READING_ID)
      references PROCESS_READING (PROCESS_READING_ID)
go

alter table PROCESS_READING
   add constraint FK_PROCESS__REFERENCE_LEAF foreign key (LEAFID)
      references LEAF (LEAFID)
go

alter table RAM_READING
   add constraint FK_RAM_READ_REFERENCE_LEAF foreign key (LEAFID)
      references LEAF (LEAFID)
go

alter table THREADS
   add constraint FK_THREADS_REFERENCE_PROCESSE foreign key (P_ID)
      references PROCESSES (P_ID)
go

alter table VIDEOCONTROLLER
   add constraint FK_VIDEOCON_REFERENCE_LEAF foreign key (LEAFID)
      references LEAF (LEAFID)
go

