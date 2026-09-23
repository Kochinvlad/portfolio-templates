import { useMemo, useState } from 'react'
import { ArrowLeft, Gift, RotateCcw, SearchX, Sparkles } from 'lucide-react'
import type { CategoryMark, Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { Button } from '../../ui/Button'
import { CategoryIcon } from '../../ui/CategoryIcon'
import { TOYS_AGE_GROUPS, TOYS_BUDGETS, TOYS_CATALOG, TOYS_INTERESTS, matchesAgeGroup } from './data'
import { ToysCard } from './ToysProduct'

type Answers = {
  ageGroupId: string | null
  interestId: string | null
  budgetId: string | null
}

const EMPTY: Answers = { ageGroupId: null, interestId: null, budgetId: null }

function OptionGrid({
  options,
  value,
  onPick,
  columns = 3,
}: {
  options: Array<CategoryMark & { id: string; label: string }>
  value: string | null
  onPick: (id: string) => void
  columns?: 2 | 3
}) {
  return (
    <div className={cn('grid gap-3', columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
      {options.map((opt) => {
        const active = opt.id === value
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onPick(opt.id)}
            aria-pressed={active}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 px-4 py-6 text-center transition',
              active
                ? 'border-brand bg-brand-soft'
                : 'border-line bg-surface-2 hover:-translate-y-0.5 hover:border-brand/50',
            )}
          >
            {opt.icon && <CategoryIcon icon={opt.icon} size={30} className="text-brand" />}
            {opt.coverId && <CategoryIcon coverId={opt.coverId} size={56} />}
            <span className="text-[15px] font-bold leading-snug text-ink">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function ToysGiftFinder({
  onOpenProduct,
  onShowAll,
}: {
  onOpenProduct: (product: Product) => void
  onShowAll: (ageGroupId: string, categoryId: string) => void
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)

  const matches = useMemo(() => {
    const { ageGroupId, interestId, budgetId } = answers
    if (!ageGroupId || !interestId || !budgetId) return []
    const age = TOYS_AGE_GROUPS.find((a) => a.id === ageGroupId)
    const budget = TOYS_BUDGETS.find((b) => b.id === budgetId)
    if (!age || !budget) return []

    const byAgeAndInterest = TOYS_CATALOG.filter(
      (p) => p.category === interestId && matchesAgeGroup(p, age),
    )

    const inBudget = byAgeAndInterest.filter(
      (p) => p.price >= budget.min && p.price <= budget.max,
    )
    // если в бюджет ничего не попало — показываем ближайшее по цене
    const result = inBudget.length > 0 ? inBudget : byAgeAndInterest
    return [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3)
  }, [answers])

  const budgetMissed =
    matches.length > 0 &&
    answers.budgetId !== null &&
    (() => {
      const budget = TOYS_BUDGETS.find((b) => b.id === answers.budgetId)
      if (!budget) return false
      return !matches.some((p) => p.price >= budget.min && p.price <= budget.max)
    })()

  const STEPS = [
    {
      title: 'Сколько лет ребёнку?',
      hint: 'Подберём игрушки, которые подходят по возрасту и безопасны.',
      options: TOYS_AGE_GROUPS.map((a) => ({ id: a.id, label: a.label, icon: a.icon })),
      value: answers.ageGroupId,
      pick: (id: string) => setAnswers((a) => ({ ...a, ageGroupId: id })),
    },
    {
      title: 'Что ему нравится?',
      hint: 'Выберите главное увлечение — по нему подберём категорию.',
      options: TOYS_INTERESTS,
      value: answers.interestId,
      pick: (id: string) => setAnswers((a) => ({ ...a, interestId: id })),
    },
    {
      title: 'Какой бюджет?',
      hint: 'Если в бюджет ничего не попадёт, покажем ближайшее по цене.',
      options: TOYS_BUDGETS.map((b) => ({ id: b.id, label: b.label })),
      value: answers.budgetId,
      pick: (id: string) => setAnswers((a) => ({ ...a, budgetId: id })),
    },
  ]

  const done = step >= STEPS.length
  const current = done ? null : STEPS[step]

  function reset() {
    setAnswers(EMPTY)
    setStep(0)
  }

  return (
    <section id="finder" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="reveal mx-auto w-full max-w-4xl rounded-card border-2 border-line bg-surface-2 p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[13px] font-extrabold text-on-brand">
            <Gift size={15} />
            Подбор подарка
          </span>
          <h2 className="mt-5 font-head text-3xl font-black leading-tight text-ink sm:text-4xl">
            {done ? 'Вот что мы нашли' : current?.title}
          </h2>
          <p className="mt-3 max-w-xl text-[16px] font-medium text-ink-soft">
            {done
              ? budgetMissed
                ? 'В указанный бюджет ничего не попало — показываем самое близкое по цене и возрасту.'
                : 'Три игрушки, которые подходят по возрасту, интересам и бюджету.'
              : current?.hint}
          </p>
        </div>

        {/* Индикатор шагов */}
        <div className="mx-auto mt-7 flex max-w-xs items-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-300',
                i < step || done ? 'bg-brand' : i === step ? 'bg-brand/45' : 'bg-line',
              )}
            />
          ))}
        </div>

        {!done && current ? (
          <div className="mt-8">
            <OptionGrid
              options={current.options}
              value={current.value}
              onPick={(id) => {
                current.pick(id)
                // небольшая пауза, чтобы выбор успел отрисоваться
                window.setTimeout(() => setStep((s) => s + 1), 220)
              }}
              columns={step === 2 ? 3 : 3}
            />
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 text-[15px] font-bold text-ink-soft transition hover:text-brand"
              >
                <ArrowLeft size={16} />
                Назад
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8">
            {matches.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {matches.map((product) => (
                    <ToysCard
                      key={product.id}
                      product={product}
                      onOpen={() => onOpenProduct(product)}
                    />
                  ))}
                </div>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (answers.ageGroupId && answers.interestId) {
                        onShowAll(answers.ageGroupId, answers.interestId)
                      }
                    }}
                  >
                    <Sparkles size={18} />
                    Показать все подходящие
                  </Button>
                  <Button variant="outline" size="lg" onClick={reset}>
                    <RotateCcw size={17} />
                    Подобрать заново
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span
                  aria-hidden="true"
                  className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand"
                >
                  <SearchX size={30} strokeWidth={1.75} />
                </span>
                <h3 className="font-head text-xl font-black text-ink">
                  По таким условиям ничего нет
                </h3>
                <p className="max-w-sm text-[15px] font-medium text-ink-soft">
                  Попробуйте выбрать другое увлечение — в этой категории для такого возраста пока
                  пусто.
                </p>
                <Button onClick={reset}>
                  <RotateCcw size={17} />
                  Подобрать заново
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
