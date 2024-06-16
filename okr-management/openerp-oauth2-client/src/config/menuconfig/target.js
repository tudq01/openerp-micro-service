export const target = {
  id: "MENU_OKR_TARGET",
  icon: "LocalLibraryIcon",
  text: "My OKR",
  isPublic: false,
  child: [
    {
      id: "MENU_OKR_TARGET.MENU_ITEM_1",
      path: "/target/list",
      isPublic: false,
      text: "My Objective",
      child: [],
    },
    {
      id: "MENU_OKR_TARGET.MENU_ITEM_2",
      path: "/target/manager",
      isPublic: false,
      text: "My Manager",
      child: [],
    },
    {
      //to remove
      id: "MENU_OKR_TARGET.MENU_ITEM_3",
      path: "/manager/period", //current admin can edit all, manager can add their employee to their department
      isPublic: false,
      text: "Target Period", //manager,admin
      child: [],
    },
  ],
};

export const department = {
  id: "MENU_OKR_DEPARTMENT",
  icon: "Department",
  isPublic: false,
  child: [
    {
      id: "MENU_OKR_DEPARTMENT.MENU_ITEM_1",
      path: "/department/list",
      isPublic: false,
      text: "Department",
      child: [],
    },
  ],
};

export const team = {
  id: "MENU_OKR_TEAM_SETTING",
  icon: "PeopleIcon",
  isPublic: false,
  child: [
    {
      //manager,admin
      // add member to your current team
      id: "MENU_OKR_TEAM_SETTING.MENU_ITEM_1",
      path: "/team/setting",
      isPublic: false,
      text: "My Employee",
      child: [],
    },
  ],
};

export const company = {
  id: "MENU_OKR_COMPANY",
  icon: "ApartmentSharpIcon",
  text: "Company OKR",
  isPublic: false,
  child: [
    {
      id: "MENU_OKR_COMPANY.MENU_ITEM_1",
      path: "/target/company",
      isPublic: false,
      text: "Company OKR",
      child: [],
    },
  ],
};

export const departmentOkr = {
  id: "MENU_OKR_TEAM",
  icon: "HomeSharpIcon",
  text: "Team OKR",
  isPublic: false,
  child: [
    {
      id: "MENU_OKR_TEAM.MENU_ITEM_1",
      path: "/target/team-member",
      isPublic: false,
      text: "Team Member OKR",
      child: [],
    },
    {
      id: "MENU_OKR_TEAM.MENU_ITEM_2",
      path: "/target/team-okr",
      isPublic: false,
      text: "My Team OKR",
      child: [],
    },
  ],
};

export const type = {
  id: "MENU_OKR_TARGET_TYPE",
  icon: "StarBorder",
  text: "Target Category",
  isPublic: false,
  child: [
    {
      id: "MENU_OKR_TARGET_TYPE.MENU_ITEM_1",
      path: "/target-category",
      isPublic: false,
      text: "Target Category",
      child: [],
    },
  ],
};
