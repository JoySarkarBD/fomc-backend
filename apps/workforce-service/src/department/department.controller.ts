import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MongoIdDto } from "../../../api-gateway/src/common/dto/mongo-id.dto";
import { SearchQueryDto } from "../../../api-gateway/src/common/dto/search-query.dto";
import { DEPARTMENT_COMMANDS } from "../../../user-service/src/constants/department.constants";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @MessagePattern(DEPARTMENT_COMMANDS.CREATE_DEPARTMENT)
  create(@Payload() createDepartmentDto: CreateDepartmentDto): Promise<any> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @MessagePattern(DEPARTMENT_COMMANDS.GET_DEPARTMENTS)
  findAll(@Payload() query: SearchQueryDto): Promise<any> {
    return this.departmentService.findDepartments(query);
  }

  @MessagePattern(DEPARTMENT_COMMANDS.GET_DEPARTMENT)
  findOne(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return this.departmentService.findDepartmentById(id);
  }

  @MessagePattern(DEPARTMENT_COMMANDS.UPDATE_DEPARTMENT)
  update(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateDepartmentDto },
  ): Promise<any> {
    return this.departmentService.updateDepartmentById(
      payload.id,
      payload.data,
    );
  }

  @MessagePattern(DEPARTMENT_COMMANDS.DELETE_DEPARTMENT)
  remove(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return this.departmentService.deleteDepartmentById(id);
  }
}
