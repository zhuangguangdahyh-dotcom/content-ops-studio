# Phase 3B G3 Review Matrix

Current gate: `CONTENT_COPY`  
Target: `C-0001`  
Target version: `CV-1:CV-1`  
Initial status: `COPY_PENDING_APPROVAL`
Final status: `COPY_APPROVED`

## Exact package under review

Title: **专业身份，先看这3点** (10 characters)

1. **先别急着相信“专业”**  
   真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。
2. **第一看：主体是谁**  
   先确认提供服务的主体名称、公开身份和实际承接方是否一致。信息越模糊，越需要继续问清。
3. **第二看：资质是否适用**  
   平台专业号认证会核验企业主体、营业执照及部分行业资质；但有认证，不等于所有服务都在适用范围内。
4. **第三看：边界是否清楚**  
   专业判断也包括知道什么能做、什么不能做、需要哪些前提。只讲结果、不讲边界，不足以支持决定。
5. **把信任变成3步核验**  
   ①主体是否清楚；②资质是否对应；③服务边界是否匹配。三项都能回答，再进入下一步沟通。
6. **先核验，再决定**  
   认证可以提供基础身份信号，但不能替代对具体能力和适用范围的判断。把证据看清，再决定要不要继续。

Publish body:

> 看到一个专业服务账号时，先别急着被头衔和包装说服。更稳妥的判断，是把“看起来专业”拆成三件能核验的事：服务主体是否清楚，展示的资质是否适用于这项服务，服务边界是否与你的实际需求匹配。
>
> 平台认证信息可以提供基础身份信号，但它不能替代你对具体能力、过程和适用范围的判断。先核验，再沟通；先确认匹配，再做决定。这样省下的不是一次提问，而是后续反复试错的时间。

Direct-message hook: empty.  
Quality: 89.5; 14/14 hard checks; 0 blockers.  
Claims: 6 total; 1 supported with limitations; 5 professional judgments; 0 unsupported.  
Duplication: LOW; non-blocking.  
Operator decision: `APPROVE` (explicitly submitted and verified).

| Review decision           | Approval written | Final status                      | Visual Planning eligible | Version             | Feedback               |
| ------------------------- | ---------------- | --------------------------------- | ------------------------ | ------------------- | ---------------------- |
| Pending Operator decision | No               | `COPY_PENDING_APPROVAL`           | No                       | `CV-1:CV-1`         | Completed pause        |
| APPROVE                   | Yes              | `COPY_APPROVED`                   | Yes; no auto-start       | `CV-1:CV-1`         | PASSED / read-verified |
| REVISE                    | Not run          | Expected `COPY_REVISION_REQUIRED` | No                       | new review required | pending                |
| REJECT                    | Not run          | Expected `CONTENT_DISCARDED`      | No                       | bound               | pending                |
| PAUSE                     | Not run          | Expected `CONTENT_PAUSED`         | No                       | bound               | pending                |

Exact approval phrase: `确认批准C-0001当前文案版本CV-1:CV-1进入G3 APPROVE`

The approval event is retained in the external Run Home. Identical approval replay reused the original event timestamp and performed zero remote updates. Formal resume returned `PASSED_NO_OP`; Visual Planning remains not started.
