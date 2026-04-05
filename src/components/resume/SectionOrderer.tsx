import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResume, ResumeSection } from "@/contexts/ResumeContext";
import { GripVertical, FileText, Briefcase, GraduationCap, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionLabels: Record<ResumeSection, { label: string; icon: React.ElementType }> = {
  summary: { label: "Professional Summary", icon: FileText },
  experience: { label: "Work Experience", icon: Briefcase },
  education: { label: "Education", icon: GraduationCap },
  skills: { label: "Skills", icon: Wrench },
};

interface SortableItemProps {
  id: ResumeSection;
}

const SortableItem = ({ id }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { label, icon: Icon } = sectionLabels[id];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card border rounded-lg cursor-grab active:cursor-grabbing",
        "hover:border-primary/50 hover:shadow-sm transition-all",
        isDragging && "opacity-50 shadow-lg border-primary z-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 hover:bg-muted rounded"
        aria-label={`Drag to reorder ${label}`}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
};

const SectionOrderer = () => {
  const { sectionOrder, setSectionOrder } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as ResumeSection);
      const newIndex = sectionOrder.indexOf(over.id as ResumeSection);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Section Order</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to reorder resume sections
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sectionOrder.map((section) => (
              <SortableItem key={section} id={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SectionOrderer;