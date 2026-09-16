import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '../store/store';
import { appliedPolicy, currentPolicy } from '../domain/policy';
import { judge } from '../domain/rules';
import type { Report } from '../domain/types';
import { fmt, won } from './bits';

/**
 * 같은 화면을 shadcn/ui 실물 컴포넌트로만 조립한 것.
 * 도메인·데이터·규칙은 아이리스 버전과 완전히 같고 UI 층만 다르다.
 */
export function DetailShadcn({ r }: { r: Report }) {
  const { s, d } = useStore();
  const applied = appliedPolicy(s.policies, r.submittedAt);
  const current = currentPolicy(s.policies, s.now);
  const j = judge(r, s.reports, s.policies);
  const basis = applied.amounts[r.defectType];
  const rows = [...s.reports].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt));

  return (
    <div className="grid grid-cols-[240px_minmax(0,1fr)] gap-4 text-foreground">
      <aside className="rounded-lg border bg-card">
        <div className="px-4 py-3">
          <div className="text-sm font-semibold">심사 큐 · {rows.length}건</div>
          <button className="text-xs text-primary" onClick={() => d({ t: 'select', id: null })}>목록 펼치기</button>
        </div>
        {rows.slice(0, 8).map((x) => (
          <button key={x.id}
            className={`flex w-full flex-col gap-1 border-t px-4 py-2.5 text-left ${x.id === r.id ? 'bg-accent' : ''}`}
            onClick={() => d({ t: 'select', id: x.id })}>
            <span className="flex items-center gap-2">
              <span className="text-sm font-medium">{x.id}</span>
              <Badge variant="outline" className="text-[11px]">{x.process}</Badge>
            </span>
            <span className="text-xs text-muted-foreground">{fmt(x.submittedAt)}</span>
          </button>
        ))}
      </aside>

      <div className="flex flex-col gap-3">
        <div>
          <div className="text-xs text-muted-foreground">심사 큐 / {r.id}</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{r.id} {r.store} · {r.customer}</h2>
          <div className="mt-2 flex gap-1.5">
            <Badge variant="outline">처리 · {r.process}</Badge>
            <Badge variant="outline">결과 · {r.outcome ?? '—'}</Badge>
            <Badge variant="outline">지급 · {r.payout.state}</Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{fmt(r.submittedAt)} 접수 · 담당 {r.assignee ?? '없음'}</div>
        </div>

        <Card>
          <CardContent className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-muted-foreground">적용 정책 · {applied.version} ({fmt(applied.effectiveFrom)} 발효) · 잠김</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">{r.defectType} {won(basis)}원</div>
              <div className="mt-1 text-sm text-muted-foreground">{r.category} (대상) · 1인 한도 {won(applied.perPersonCap)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">산정</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">{r.payout.amount === null ? '미확정' : `${won(r.payout.amount)}원`}</div>
              <div className="mt-1 text-sm text-muted-foreground">기준액 {won(basis)} → 한도 조정 → 최종 {r.payout.amount === null ? '—' : won(r.payout.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">다음 행동</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">{j.blocked ? '선행 건 판정' : r.evidenceOk ? '지급 확정' : '보완 요청'}</div>
              <div className="mt-1 text-sm text-muted-foreground">판정 패널에서 진행합니다</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-3">
          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">접수 근거</CardTitle></CardHeader>
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>항목</TableHead>
                      <TableHead>적용 {applied.version}</TableHead>
                      <TableHead>현재 {current.version} · 비교</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/60">
                      <TableCell className="font-medium">{r.defectType}</TableCell>
                      <TableCell className="font-medium">{won(basis)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {basis === current.amounts[r.defectType] ? '—' : won(current.amounts[r.defectType])}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>대상 카테고리</TableCell>
                      <TableCell>{applied.categories.join(' · ')}</TableCell>
                      <TableCell className="text-muted-foreground">—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1인 한도</TableCell>
                      <TableCell>{won(applied.perPersonCap)}</TableCell>
                      <TableCell className="text-muted-foreground">—</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">증빙 · 유효성 평가</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                  {r.evidenceNote ?? '사진 2장 · 라벨 판독 가능'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">판정</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="defect">결함 유형</Label>
                <Select defaultValue={r.defectType}>
                  <SelectTrigger id="defect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'] as const).map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">변경 시 사유 필수</p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="reason">사유</Label>
                <Input id="reason" placeholder="재분류 · 판정 근거" />
              </div>
              {j.blocked ? (
                <div className="rounded-md border bg-muted/60 p-3 text-sm">
                  <div className="font-medium">확정 불가 — {j.blocked.reason}</div>
                  <Button variant="outline" size="sm" className="mt-2"
                    onClick={() => j.blocked?.targetId && d({ t: 'select', id: j.blocked.targetId })}>
                    선행 건 {j.blocked.targetId} 열기
                  </Button>
                </div>
              ) : (
                <Button className="w-full">
                  {j.amount === 0 ? `${j.outcome} · 0원으로 확정` : `지급 확정 ${won(j.amount)}원`}
                </Button>
              )}
              <Button variant="outline" className="w-full" disabled={(r.supplement?.count ?? 0) >= 1}>
                보완 요청 {(r.supplement?.count ?? 0) >= 1 ? '· 남은 횟수 0' : '· 남은 횟수 1'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
